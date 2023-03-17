import React from "react";
import PropTypes from 'prop-types';
import { Dots } from "react-activity";
import ReactModal from "react-modal";
import "react-activity/dist/Dots.css";

export default function Loading ({message}) {

  return(
    <ReactModal isOpen ariaHideApp={false} className="flex w-full h-full bg-modal backdrop-blur-sm z-50 items-center justify-center">
      <div className="bg-base-200 rounded shadow-md flex flex-col justify-center items-center px-14 py-4">
        <p className="mb-2 whitespace-pre-line">{message}</p>
        <Dots color="#6219e2" />
      </div>
    </ReactModal>
  )
}

Loading.defaultProps = {
  message: "",
}

Loading.propTypes = {
  message: PropTypes.string
}