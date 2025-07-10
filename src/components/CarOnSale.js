import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { getRequest } from "./ApiCalls";
import { getUrl } from "./ApiCalls";
import CONSTANT from "./Global";
import { Link } from "react-router-dom";

export default function CarOnSale() {
  const [carSlotList, setCarSlotList] = useState([]);
  const [carSlot, setCarSlot] = useState({});
  const [auction, setAuction] = useState();
  const [filterSlotTime, setFilterSlotTime] = useState(null);
  // const[sTime,setTime]=useState()
  // setTime("ST")
  //console.log(sTime)
  const [targetTime, setTargetTime] = useState(); // Set target time (current time + 10 minutes)
  const [timeDifference, setTimeDifference] = useState(null);
  const Ref = useRef(null);

  React.useEffect(() => {
    getRequest({
      requesturl: getUrl() + `/Auction/SlotCarList`,
    }).then((res) => {
      setCarSlotList(res.list);
    });
  }, []);

  React.useEffect(() => {
    getRequest({
      requesturl: getUrl() + `/Auction/FilterSlot`,
    }).then((res) => {
      setCarSlot(res.model);
      setFilterSlotTime(res.model.lblSlotTime);
      //SetTime();
      startCountdown();
    });
  }, []);

  const SetAuction = async () => {
    const res = await getRequest({
      requesturl: getUrl() + `/Auction/SetAuction`,
    });
    setAuction(res.model);
    console.log(res);
    const rest = await getRequest({
      requesturl: getUrl() + `/Auction/FilterSlot`,
    });
    setFilterSlotTime(rest.model.lblSlotTime);
    //SetTime();
    startCountdown();
  };

  const SetTime = async () => {
    console.log(filterSlotTime);
    const timestamp = new Date(filterSlotTime);
    const milliseconds = timestamp.getTime();
    setTargetTime(milliseconds);
  };

  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const calculateTimeRemaining = () => {
    const slotexpirationTime = new Date(filterSlotTime);
    //console.log("filterslottime in remaining".slotexpirationTime);
    const timeinmiliseconds = slotexpirationTime.getTime();
    const timeRemaining = Math.max(0, timeinmiliseconds - new Date().getTime());

    return timeRemaining;
  };

  const startCountdown = () => {
    if (Ref.current) clearInterval(Ref.current);
    const intervalId = setInterval(() => {
      //setCurrentTime(new Date().getTime());

      const remaining = calculateTimeRemaining();
      setTimeDifference(formatTime(remaining));
      // if (remaining === 0) {
      //   clearInterval(intervalId); // Stop the countdown when time reaches zero
      // }
    }, 1000);
    Ref.current = intervalId;
    //return () => clearInterval(intervalId);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    startCountdown();
  }, [filterSlotTime]); // Run once on mount

  // Calculate the time 10 minutes from the current time

  //Kenteken formate
  const isLetter = (c) => /^[A-Za-z]$/.test(c);
  const isDigit = (c) => /^[0-9]$/.test(c);

  const formatKenteken = (kenteken) => {
    if (kenteken.length === 6) {
      const temp = kenteken.toUpperCase();
      const ch01 = temp[0],
        ch02 = temp[1],
        ch03 = temp[2],
        ch04 = temp[3],
        ch05 = temp[4],
        ch06 = temp[5];

      if (
        isLetter(ch01) &&
        isLetter(ch02) &&
        isLetter(ch03) &&
        isLetter(ch06) &&
        isDigit(ch04) &&
        isDigit(ch05)
      ) {
        return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
      } else if (
        isLetter(ch01) &&
        isDigit(ch02) &&
        isDigit(ch03) &&
        isLetter(ch04) &&
        isLetter(ch05) &&
        isLetter(ch06)
      ) {
        return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
      } else if (
        isDigit(ch01) &&
        isLetter(ch02) &&
        isLetter(ch03) &&
        isDigit(ch04) &&
        isDigit(ch05) &&
        isDigit(ch06)
      ) {
        return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
      } else if (
        isDigit(ch01) &&
        isDigit(ch02) &&
        isDigit(ch03) &&
        isLetter(ch04) &&
        isLetter(ch05) &&
        isDigit(ch06)
      ) {
        return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
      } else if (
        (isDigit(ch01) && isLetter(ch02)) ||
        (isLetter(ch01) && isDigit(ch02))
      ) {
        return `${ch01}-${temp.substring(1, 4)}-${temp.substring(4, 6)}`;
      } else if (
        (isDigit(ch05) && isLetter(ch06)) ||
        (isLetter(ch05) && isDigit(ch06))
      ) {
        return `${temp.substring(0, 2)}-${temp.substring(2, 5)}-${ch06}`;
      } else {
        return `${temp.substring(0, 2)}-${temp.substring(
          2,
          4
        )}-${temp.substring(4, 6)}`;
      }
    } else {
      return kenteken.toUpperCase();
    }
  };
  localStorage.setItem("time", timeDifference);

  return (
    <React.Fragment>
      <div className="conatiner-fluid content-inner mt-5 py-0">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="border border-bottom-0 ">
                  <div className="row">
                    <div className="col-md-4">
                      <p>Time Remaining: {timeDifference}</p>
                    </div>
                    <div className="col-md-4">
                      {timeDifference <= "09:00" ? (
                        <Link className="nav-link active" to="/carAuction">
                          <p
                            style={{
                              color: "green",
                              animationBlinker: ".75s linear infinite",
                            }}
                          >
                            Click here for last minute bids
                          </p>
                        </Link>
                      ) : (
                        <Link
                          hidden
                          className="nav-link active"
                          to="/carAuction"
                        >
                          <p
                            style={{
                              color: "green",
                              animationBlinker: ".75s linear infinite",
                            }}
                          >
                            Click here for last minute bids
                          </p>
                        </Link>
                      )}
                    </div>
                    <div className="col-md-4">
                      <p>Last Update</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <img src="img/BCAImg.png" style={{ width: "60px" }} />
                    </div>
                    <div className="col-md-4">
                      <h5>{carSlot.lblSlotName}</h5>
                    </div>
                    <div className="col-md-4">
                      <p>Runoff begins {auction}</p>
                      <br />
                      <div
                        className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                        style={{ width: "150px" }}
                        onClick={() => SetAuction()}
                      >
                        Set Auction
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-bottom-0 table-responsive mt-4">
                  <table
                    id="basic-table"
                    className="table table-striped mb-0"
                    role="grid"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Auto details</th>
                        <th scope="col" className="text-end">
                          Tijd
                        </th>
                        <th scope="col" className="text-end">
                          Geboden no.
                        </th>
                        <th scope="col" className="text-end">
                          Uw bod
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {carSlotList.map((item, index) => (
                        <tr key={index}>
                          <td className="align-top">
                            <h5>
                              <a href="">{item.carBasic}</a>
                            </h5>
                            <p>
                              {item.carIndexLine +
                                formatKenteken(item.kentekensId)}
                              <br /> {item.carDetails}
                              <br /> {item.carAccessories}
                            </p>
                          </td>
                          <td className="align-top text-end">
                            <div className="d-inline-flex align-items-center">
                              <svg
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                version="1.1"
                                viewBox="48 48 416 416"
                              >
                                <g>
                                  <path d="M256,48C141.1,48,48,141.1,48,256s93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48z M273,273H160v-17h96V128h17   V273z" />
                                </g>
                              </svg>

                              <img
                                src="img/dashboard/5.png"
                                width="30"
                                className="ms-2"
                                alt=""
                              />

                              <span className="ms-4">
                                {item.expirationTime}
                              </span>
                            </div>
                          </td>
                          <td className="align-top text-end">
                            <h5 className="fw-normal mb-2">
                              &euro;
                              {item.highestBid < item.priceStart
                                ? item.priceStart
                                : item.highestBid}
                            </h5>
                            <input
                              type="range"
                              readOnly
                              value={
                                item.highestBid < 0
                                  ? item.priceStart
                                  : item.highestBid
                              }
                              min={item.priceStart}
                              max={item.priceLimit}
                            />
                          </td>
                          <td className="align-top text-end">
                            <h5>
                              Bied <a href="">Marge</a>
                            </h5>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
