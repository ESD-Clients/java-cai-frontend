import React from "react";
import PropTypes from 'prop-types';
import { clearModal } from "./Modal";
import ReactModal from "react-modal";

export default function MessageBox ({title, message, onPress, type}) {

  return(
    <ReactModal isOpen ariaHideApp={false} className="absolute bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center">
      <div className="bg-base-200 shadow-md flex flex-col px-8 py-4 rounded" style={{ minWidth: "240px" }}>
        <div className="flex flex-col  md:flex-row-reverse md:justify-between md:items-center mb-4">
          {
            type === "success" ? 
              <i className="fas fa-circle-check text-center text-4xl text-green-400" />
            : type === "warning" ? 
              <i className="fas fa-triangle-exclamation text-center text-4xl text-orange-400" />
            : type === "danger" ? 
              <i className="fas fa-circle-exclamation text-center text-4xl text-red-400" />
            :
              <i className="fas fa-circle-info text-center text-4xl text-blue-400" />
          }
          <h1 className="mb-2 text-sm font-bold mt-4 md:mt-0">{title}</h1>
        </div>
        <p className="mb-2 tex whitespace-pre-line">{message}</p>

        <div className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-end space-y-2 space-x-0 md:space-y-0">
            <button
              className="btn btn-ghost font-bold uppercase text-xs w-full md:w-20 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="submit"
              onClick={ () => {
                onPress();
                clearModal();
              }}
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

MessageBox.defaultProps = {
  title: "Message",
  message: "This is a message",
  onPress: () => {},
  type: "info"
}

MessageBox.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onPress: PropTypes.func,
  type: PropTypes.oneOf(["info", "success", "warning", "danger"])
}