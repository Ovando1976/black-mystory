{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
let email = 'test@example.com';



test('renders learn react link', () => {
  
  let password = 'your_password'; // Define the 'password' variable
  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


//userCredential.user.uid
//userCREdential.user.email
//user Credential.user.displayName
//UserCrendential.user.photoURL
