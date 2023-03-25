import React from "react";

const PopUp = ({ setModal, setSelectedID, id, title, deleteData }) => {
  return (
    <div className="popUpNotShowed">
      <div className="del-button">
        <p>Are your really want to delete"{title}"?</p>
        <div className="buttons-todos-flex">
          <button
            onClick={() => {
              deleteData(id);
              setModal(false);
              setSelectedID("");
            }}
            className="button-absolute"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setModal(false);
              setSelectedID("");
            }}
            className="button-absolute"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
