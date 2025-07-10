import * as React from "react";

export  function AddCar() {
    return(
        <React.Fragment>
             <div className="conatiner-fluid content-inner mt-5 py-0">
             <div className="bd-example">
             <fieldset className="mb-3">
             <span id="basic-addon1">NL license plate present</span>
                <div className="form-check">
                    <input type="radio" name="radios" className="form-check-input" id="exampleRadio1"/>
                    <label className="form-check-label" htmlFor="exampleRadio1">yes</label>
                </div>
                <div className="mb-3 form-check">
                    <input type="radio" name="radios" className="form-check-input" id="exampleRadio2"/>
                    <label className="form-check-label" htmlFor="exampleRadio2">No</label>
                </div>
            </fieldset>
    
        <div className="input-group">
            <span className="input-group-text">License plate</span>
            <input className="form-control" aria-label="With textarea"/>
        </div>
        <label htmlFor="basic-url" className="form-label">Your vanity URL</label>
        <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">https://example.com/users/</span>
            <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">$</span>
            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)"/>
            <span className="input-group-text">.00</span>
        </div>
        <div className="input-group">
            <span className="input-group-text">With textarea</span>
            <textarea className="form-control" aria-label="With textarea"></textarea>
        </div>
    </div>
             </div>
         
        </React.Fragment>
    )
}