import PropTypes from 'prop-types'
import ReactDOM from 'react-dom/client';
import ConfirmationBox from './ConfirmationBox';
import Loading from './Loading'
import MessageBox from './MessageBox';

const modalContainer = ReactDOM.createRoot(document.getElementById('modal-container'));

export function showLoading({message}) {
  modalContainer.render(<Loading message={message}/>)
}

export function showMessageBox({title, message, onPress, type}) {
  modalContainer.render(<MessageBox title={title} message={message} onPress={onPress} type={type} />)
}

export function showConfirmationBox({title, message, onYes, onNo, type}) {
  modalContainer.render(<ConfirmationBox title={title} message={message} onYes={onYes} onNo={onNo} type={type}/>)
}

export function clearModal() {
  modalContainer.render(null)
}

showLoading.propTypes = {
  message: PropTypes.string
}
showMessageBox.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onPress: PropTypes.func,
  type: PropTypes.oneOf(["info", "success", "warning", "danger"])
}
showConfirmationBox.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
  type: PropTypes.oneOf(["info", "success", "warning", "danger"])
}

showConfirmationBox.defaultProps = {
  title: "Confirmation"
}
