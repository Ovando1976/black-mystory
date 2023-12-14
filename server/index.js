// helmet helps make requests to server secure
const helmet = require("helmet");
// morgan helps log server requests
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
// used for uploading files (not a good idea practice to do it in the app but this is done for example purposes - usually files are hosted on AWS or something similar)
const multer = require("multer");
// used to fetch uploaded files from server
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const OpenAI = require('openai');
const HttpsProxyAgent = require('https-proxy-agent');
// Proxy Server Configuration
const proxyPort = process.env.PROXY_PORT || 3000; // Define proxy port
const agent = new HttpsProxyAgent(`http://localhost:${proxyPort}`); // Create proxy agent
const { body } = require('express-validator');


const app = express();
const port = process.env.PORT || 8080; // Use the provided PORT or default to 8080
// Middleware
app.use(bodyParser.json());
// we redirect requests to localhost:5000/images to the folder
app.use("/images", express.static(path.join(__dirname, "public/images")));

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

var serviceAccount = require("C:/Users/ovand/Downloads/cuttingedgeai-firebase-adminsdk-yyiv5-7514190226.json");

// Firebase Admin SDK Initialization with Proxy Agent
admin.initializeApp({
  credential: admin.credential.applicationDefault(agent),
  httpAgent: agent,
  databaseURL: "https://cuttingedgeai-default-rtdb.firebaseio.com"
});






// Configure multer to use Firebase Storage
const upload = multer({
  storage: MulterFirebaseStorage({
    bucketName: 'your_firebase_bucket_name',
    credentials: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    public: true,
    unique: true, // Generates a unique file name
  }),
});

// Endpoint to handle file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fileRef = storage().bucket().file(file.filename);

    // Get the public URL for the file
    const publicUrl = fileRef.publicUrl();

    // Save file reference to Firestore
    // For example, saving under a collection 'uploads'
    const db = getFirestore();
    const docRef = db.collection('uploads').doc();
    await docRef.set({
      url: publicUrl,
      // add other file metadata if needed
    });

    return res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error uploading file");
  }
});





app.use(cors({
  origin: "https://organic-space-yodel-ww7w75v6xvwh9g9x-8082.app.github.dev/"
}));


const io = require('socket.io')( {
  cors: {
    origin: "https://organic-space-yodel-ww7w75v6xvwh9g9x-8082.app.github.dev/",
    methods: ["GET", "POST"]
  }
});





const db = admin.firestore();
const storage = getStorage();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, './build')));



// Handle POST requests for completions
app.post('/completions', async (req, res) => {
  const prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;

  try {
    const openAIResponse = await openai.complete({
      model: "GPT-4",  // You can specify your model here, I'm using "text-davinci-002" as an example
      prompt: prompt,
      max_tokens: maxTokens,
    });
    res.status(200).send(openAIResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('OpenAI API request failed.');
  }
});

const chatRoutes = require('./routes/api/openai');
app.use(chatRoutes);

// Mock user profile data
const userProfileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  contact: "123-456-7890",
  avatar: "https://unsplash.com/photos/black-haired-man-making-face-sibVwORYqs0"
};

// User profile endpoint
app.get('/api/userProfile', (req, res) => {
  // You can add logic here to fetch real user data in a real-world application
  res.status(200).json(userProfileData);
  console.log('User profile data sent successfully!')
});

app.post('/api/uploadImage', upload.single('image'), (req, res) => {
  // req.file contains information about the uploaded file
  // You can now store this file in your preferred storage solution
  // and update the user's profile with the image's URL
});







// Serve the React web application
app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

// API endpoint to handle chat completions
app.post('/api/chat/completions', cors(), async (req, res) => {
  const message = req.body.message;

  const chatCompletion = functions.https.onCall((data) => {
    return openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'Your system message here.' }, { role: 'user', content: data.message }],
    });
  });

  try {
    const response = await chatCompletion({ message });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// GitHub User Profile API Endpoint
app.get('/api/user/profile/:userId', cors(), async (req, res) => {
  const userId = req.params.userId;

  const getUserProfile = functions.https.onCall((data) => {
    return axios.get(`https://api.github.com/users/${data.userId}`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`,
      },
    });
  });

  try {
    const response = await getUserProfile({ userId });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response ? error.response.status : 500).json({ error: 'Error fetching user profile' });
  }
});

// Firebase Firestore Endpoint for Posting an Article
app.post('/api/firebase/article', cors(), async (req, res) => {
  const articleData = req.body;

  const postArticle = functions.https.onCall((data) => {
    return admin.firestore().collection('articles').add(data.articleData);
  });

  try {
    await postArticle({ articleData });
    res.status(201).json({ message: 'Article added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding article to Firestore' });
  }
});


// server.js
app.post('/api/booking', cors(), async (req, res) => {
  const bookingData = req.body;

  try {
    // Implement logic to handle booking confirmation (e.g., send email, store data)
    // ...

    res.status(201).json({ message: 'Booking confirmed!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing booking' });
  }
});

app.post('/api/register', cors(), async (req, res) => {
  const userData = req.body;

  try {
    // Implement logic to register new user (e.g., validate data, create user account)
    // ...

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid registration data' });
  }
});


app.post('/api/reviews', cors(), async (req, res) => {
  const reviewData = req.body;

  try {
    // Implement logic to store user review and rating (e.g., write to database)
    // ...

    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting review' });
  }
});


app.get('/api/news', cors(), async (req, res) => {
  // Implement logic to fetch news articles data (e.g., from external API or database)
  // ...

  const newsArticles = []; // Replace with actual data

  res.json(newsArticles);
});


// Function to generate a response from OpenAI's GPT model
// Function to generate a response from OpenAI's GPT model
async function generateAIResponse(message) {
  const openAIResponse = await openai.createChatCompletion({
    model: 'gpt-4', // or another model of your choice
    messages: [{ role: 'user', content: message }]
  });
  
  // Log the response
  console.log("OpenAI Response:", openAIResponse.data);

  return openAIResponse.data;
}

// Endpoint to handle chat completions
app.post('/api/chat/completions', cors(), async (req, res) => {
  const message = req.body.message;

  try {
    const response = await generateAIResponse(message);
    
    // Log the response
    console.log("Response to be sent:", response);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating response' });
  }
});



app.get('/api/history', cors(), async (req, res) => {
  try {
    // Assuming your history data is stored in a collection named 'history'
    const historyCollection = db.collection('history');
    const snapshot = await historyCollection.get();

    const historyData = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    res.json(historyData);
  } catch (error) {
    console.error('Error fetching history data:', error);
    res.status(500).json({ error: 'Error fetching history data' });
  }
});


app.post('/api/itinerary/destination', 
  body('city').isString().trim().escape(), 
  async (req, res) => {
    const { city } = req.body;

    // Check if city name is provided
    if (!city || city.length === 0) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Additional logic to process the city name
    // For example, you might want to check if the city is available in your database,
    // or perform some other business logic relevant to your application.

    // If everything is okay, send a success response
    res.status(200).json({ message: `City name ${city} processed successfully` });
});


app.post('/api/itinerary/dates', 
  body('startDate').isDate(),
  body('endDate').isDate().optional({ checkFalsy: true }), // endDate is optional but validated if provided
  async (req, res) => {
    const { startDate, endDate } = req.body;
    // Process and validate travel dates
    // Check if endDate is after startDate, etc.
    // ...
});

app.post('/api/itinerary/preferences', 
  body('budget').isNumeric().withMessage('Budget must be a numeric value'),
  body('preferences').isObject(), // Assuming preferences is an object with more properties
  async (req, res) => {
    const { preferences } = req.body;
    // Process and validate user preferences
    // ...
});

console.log('API Key from .env:', process.env.OPENAI_API_KEY);



app.post('/createPost', async (req, res) => {
  try {
    const { uid, text, imageUrl } = req.body; // imageUrl is the URL of the uploaded image/video
    const postRef = db.collection('posts').doc();
    
    await postRef.set({
      userId: uid,
      text: text,
      imageUrl: imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send({ message: 'Post created successfully', postId: postRef.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/taxi_rates.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/taxi_rates.html'));
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

