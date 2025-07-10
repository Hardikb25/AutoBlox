import * as React from "react";
import { Link } from "react-router-dom";


function Footer() {
  return (
    // <!-- Footer start -->
    <footer className="bg-primary footer text-white">
      <div className="container">
        <div className="d-flex justify-content-between">
          <div>
          <a  href="#">
            <img
              src="images/hero-autoblox.png"
              alt=""
              width="203"
              height="55"
            />
            </a>
          </div>

          <div className="d-flex">
            {/* <!-- BCA Autoveilingen start --> */}
            <div className="me-60">
              <h3 className="mb-0">BCA Autoveilingen</h3>
              <p className="mb-0">
                De Landweer 4 <br /> 3771 LN Barneveld <br />
                <a href="mailto:info.nl@bca.com" className="text-white">
                  info.nl@bca.com
                </a>{" "}
                <br />
                <a href="#" className="text-white">
                  www.bca.com
                </a>
              </p>
            </div>
            {/* <!-- BCA Autoveilingen end --> */}

            {/* <!-- BCA AutoBLOX veilingen start --> */}
            <div className="me-26">
              <h3 className="mb-0">BCA AutoBLOX veilingen</h3>
              <p className="mb-0">
                De Landweer 4 <br /> 3771 LN Barneveld <br />
                <a href="mailto:info.nl@bca.com" className="text-white">
                  info.nl@bca.com
                </a>{" "}
                <br />
                <a href="#" className="text-white">
                  www.bca.com
                </a>
              </p>
            </div>
            {/* <!-- BCA AutoBLOX veilingen end -->    */}

            <div>
              <p className="mb-0">
                <a href="#" className="text-white">
                  Algemene voorwaarden
                </a>{" "}
                <br />
                <a href="#" className="text-white">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    /* <!-- Footer end --> */
  );
}

export default Footer;
