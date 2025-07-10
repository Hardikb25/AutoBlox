import * as React from "react";


function ModalPopup(props) {

  React.useEffect(() => {

  }, []);

  return (
    <React.Fragment>
      <div>



        <div
          className="modal fade"
          id={props.modalId}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog max-w-700px">
            <div className="modal-content">
              <div className="modal-header text-white bg-primary p-4">
                <h2 className="text-white mb-0 text-ellipsis">
                  {props.modalTitle}
                </h2>
                <button
                  type="button"
                  className="btn-close text-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              {props.Modalbody}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Annuleren
                </button>
                {props.kenteknModalComplete
                  ? <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={props.modelOkClick}>OK</button>
                  : <button type="button" class="btn btn-primary" onClick={props.modelOkClick}>OK</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ModalPopup;
