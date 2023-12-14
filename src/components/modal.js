import styles from '../styles/modal.module.css';

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
  
export default Modal;