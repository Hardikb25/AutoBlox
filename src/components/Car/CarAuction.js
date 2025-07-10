import * as React from "react";
import * as signalR from "@microsoft/signalr";
import { useState, useEffect, useRef } from "react";
import { getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import { getUrl } from "../ApiCalls";
import { Navigate,useNavigate } from "react-router";
function AuctionPage() {
  const history = useNavigate();
  const [messages, setMessages] = useState({});
  const [user, setUser] = useState("");
  const [bidCarA, setBidCarA] = useState({});
  const loginUser = localStorage.getItem("UserName");
  const [connection, setConnection] = useState(null);
  const [carSlot, setCarSlot] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [timeDifference, setTimeDifference] = useState(null);
  const [filterSlotTime, setFilterSlotTime] = useState(null);
  
  const Ref = useRef(null);
  const isLetter = (c) => /^[A-Za-z]$/.test(c);
  const isDigit = (c) => /^[0-9]$/.test(c);

  const formatKenteken = (kenteken) => {
    if (kenteken != undefined && kenteken.length === 6) {
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
      return 0;
      //  kenteken.toUpperCase();
    }
  };

  React.useEffect(() => {
    getRequest({
      requesturl: getUrl() + `/Auction/FilterSlot`,
    }).then((res) => {
      if(res.status == 401){
        history("/");
      }
      else{
      setFilterSlotTime(res.model.lblSlotTime);
      setCarSlot(res.model.lblSlotTime);
      startCountdown();
      }
    });
  }, []);

  useEffect(
    () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7277/chathub")
        .build();
      setConnection(newConnection);

      newConnection
        .start()
        .then(() => console.log("Connection established"))
        .catch((err) => console.error("Error establishing connection:", err));

      newConnection.on("ReceiveMessage", (BidPrice, BidUserId) => {
        setMessages({ BidPrice, BidUserId });
      });

      return () => {
        newConnection.stop();
      };
    },
    { messages }
  );

  const sendMessage = async (bidPrice) => {
    const res = await getRequest({
      requesturl: getUrl() + `/Auction/SlotCarList`,
    });

    // Assuming the API response contains a property 'list' and you want the first item
    const bidCarA = res.list[0];
    setBidCarA(bidCarA);
    var userId = localStorage.getItem("UserId");
    var CompanyId = localStorage.getItem("CompanyId");
    var carId = 7474053;
    var sloteId = 59785;
    var carSalestatusId = 968767;
    var actualBidPrice = 0;
    if (bidCarA.highestBid > bidCarA.priceStart) {
      actualBidPrice = bidPrice + bidCarA.highestBid;
    } else {
      actualBidPrice = bidCarA.priceStart + bidPrice;
    }

    if (connection) {
      await connection.send(
        "SendMessage",
        loginUser,
        actualBidPrice,
        carId,
        sloteId,
        carSalestatusId,
        CompanyId,
        userId
      );
    }
  };

  const [carSlotList, setCarSlotList] = useState([]);
  const [bidCar, setBidCar] = useState({});
  React.useEffect(() => {
    getRequest({
      requesturl: getUrl() + `/Auction/SlotCarList`,
    }).then((res) => {
      if(res.status == 401){
        history("/");
      }
      else{
      setCarSlotList(res.list.slice(1));
      setBidCar(res.list[0]);
      }
    });
  }, []);

  const startCountdown = () => {
    if (Ref.current) clearInterval(Ref.current);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());

      const remaining = calculateTimeRemaining();
      setTimeDifference(formatTime(remaining));
    }, 1000);
    Ref.current = intervalId;
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  const calculateTimeRemaining = () => {
    const slotexpirationTime = new Date(filterSlotTime);
    //console.log("filterslottime in remaining".slotexpirationTime);
    const timeinmiliseconds = slotexpirationTime.getTime();
    const timeRemaining = Math.max(0, timeinmiliseconds - new Date().getTime());

    return timeRemaining;
  };

  useEffect(() => {
    startCountdown();
  }, [filterSlotTime]); // Run once on mount
  return (
    <React.Fragment>
      <div className="conatiner-fluid content-inner mt-5 py-0">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                  {messages.BidUserId === localStorage.getItem("UserId") ||
                  messages.BidUserId === undefined ? (
                    <div
                      className="border-2 rounded mobiDiv py-4 px-4"
                      style={{ border: "1px solid #008E54" }}
                    >
                      <h4 className="text-center pb-2">{timeDifference}</h4>

                      <div className="imgDiv position-relative">
                        <img
                          src="img/dashboard/5.png"
                          className="img-fluid w-100 position-absolute"
                          alt="img8"
                        />
                      </div>

                      <h5 className="pb-3" style={{ marginTop: "170px" }}>
                        1. <a href="">{bidCar.carBasic}</a>
                      </h5>
                      <div className="text-center">
                        <p className="mb-0">
                          {formatKenteken(bidCar.kentekensId) +
                            " " +
                            bidCar.carDetails}
                        </p>
                        <a className="fw-bolder" href="">
                          Excl. BTW
                        </a>
                        <h5 style={{ color: "#008E54" }}>
                          Hoogste bod:
                          {messages.BidPrice == null
                            ? bidCar.highestBid
                            : messages.BidPrice}
                        </h5>
                        <p className="mb-0" style={{ color: "#008E54" }}>
                          U heeft het hoogste bod!
                        </p>
                      </div>
                      <div className="grid gap-1 gap-md-3 mb-4">
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(50)}
                        >
                          +50
                        </div>
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(100)}
                        >
                          +100
                        </div>
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(150)}
                        >
                          +150
                        </div>
                      </div>
                      <input
                        type="range"
                        readOnly
                        style={{ width: "100%" }}
                        value={
                          messages.BidPrice == null
                            ? bidCar.highestBid
                            : messages.BidPrice
                        }
                        min={bidCar.priceStart}
                        max={bidCar.priceLimit}
                      />
                    </div>
                  ) : (
                    <div
                      className="border-2 rounded mobiDiv py-4 px-4"
                      style={{ border: "1px solid #FF0000" }}
                    >
                      <h4 className="text-center pb-2">
                        {formatTime(calculateTimeRemaining())}
                      </h4>

                      <div className="imgDiv position-relative">
                        <img
                          src="img/dashboard/5.png"
                          className="img-fluid w-100 position-absolute"
                          alt="img8"
                        />
                      </div>

                      <h5 className="pb-3" style={{ marginTop: "170px" }}>
                        1. <a href="">{bidCar.carBasic}</a>
                      </h5>
                      <div className="text-center">
                        <p className="mb-0">
                          {formatKenteken(bidCar.kentekensId) +
                            " " +
                            bidCar.carDetails}
                        </p>
                        <a className="fw-bolder" href="">
                          Excl. BTW
                        </a>
                        <h5 style={{ color: "#FF0000" }}>
                          Hoogste bod:
                          {messages.BidPrice == null
                            ? bidCar.highestBid
                            : messages.BidPrice}
                        </h5>
                        <p className="mb-0" style={{ color: "#FF0000" }}>
                          U bent overboden!{" "}
                        </p>
                      </div>
                      <div className="grid gap-1 gap-md-3 mb-4">
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(50)}
                        >
                          +50
                        </div>
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(100)}
                        >
                          +100
                        </div>
                        <div
                          className="btn g-col-4 border border-2 text-center rounded h-40px d-flex align-items-center justify-content-center"
                          onClick={() => sendMessage(150)}
                        >
                          +150
                        </div>
                      </div>
                      <input
                        type="range"
                        readOnly
                        style={{ width: "100%" }}
                        value={
                          messages.BidPrice == null
                            ? bidCar.highestBid
                            : messages.BidPrice
                        }
                        min={bidCar.priceStart}
                        max={bidCar.priceLimit}
                      />
                    </div>
                  )}
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
                              value={item.highestBid}
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
export default AuctionPage;
