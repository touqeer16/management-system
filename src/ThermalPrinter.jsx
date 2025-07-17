import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image';
import exportAsImage from './utils/exportAsImage';


const ThermalPrinter = () => {
  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.8.103");
  const [printerPort, setPrinterPort] = useState("9100");
  const [textToPrint, setTextToPrint] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");

  const ePosDevice = useRef();
  const printer = useRef();
  const exportRef = useRef();

  const STATUS_CONNECTED = "Connected";


  const connect = () => {
    setConnectionStatus("Connecting ...");

    if (!printerIPAddress) {
      setConnectionStatus("Type the printer IP address");
      return;
    }
    if (!printerPort) {
      setConnectionStatus("Type the printer port");
      return;
    }
    setConnectionStatus("Connecting ...");
    let ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;
    ePosDev.connect(printerIPAddress, printerPort, (data) => {
      ePosDev.createDevice("local_printer", ePosDev.DEVICE_TYPE_PRINTER, { crypto: true, buffer: false }, (devobj, retcode) => {
        printer.current = devobj;
        if (retcode === "OK") {
          printer.current = devobj;
          setConnectionStatus(STATUS_CONNECTED);
        } else {
          throw retcode;
        }
      }
      );
    });
  };
  const print = (text) => {
    let ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;
    ePosDev.connect(printerIPAddress, printerPort, (data) => {
      ePosDev.createDevice("local_printer", ePosDev.DEVICE_TYPE_PRINTER, { crypto: true, buffer: false }, (devobj, retcode) => {
        if (retcode === "OK") {
          printer.current = devobj;
          let prn = printer.current;
          prn.addCut(prn.CUT_FEED);
          if (!prn) {
            alert("Not connected to printer");
            return;
          }
          let context = "D:\temp\test.png";

          prn.addText(text);
          prn.addFeedLine(5);
          // prn.print(can, prn.CUT_FEED);
          // prn.addImage(context, 80, 80, 80, 80);
          prn.addCut(prn.CUT_FEED);
          prn.send();
        } else {
          throw retcode;
        }
      }
      );
    });

  };
  const captureElement = async (element) => {
    const canvas = await html2canvas(element);
    document.body.appendChild(canvas);
  }

  const handleDownloadImage = () => {


    // const element = document.getElementById('print'),
    //   canvas = html2canvas(element),
    //   data = canvas.toDataURL('image/jpg'),
    //   link = document.createElement('a');

    // link.href = data;
    // link.download = 'downloaded-image.jpg';

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // const input = document.getElementById('divToOfferInfo');
    // const pdf = new jsPDF();
    // if (pdf) {
    //   domtoimage.toPng(input)
    //     .then(imgData => {
    //       pdf.addImage(imgData, 'PNG', 10, 10);
    //       pdf.save('download.pdf');
    //     });
    // }

  };


  return (
    <div id="thermalPrinter">
      <input
        id="printerIPAddress"
        placeholder="Printer IP Address"
        value={printerIPAddress}
        onChange={(e) => setPrinterIPAddress(e.currentTarget.value)}
      />
      <input
        id="printerPort"
        placeholder="Printer Port"
        value={printerPort}
        onChange={(e) => setPrinterPort(e.currentTarget.value)}
      />
      <button
        disabled={connectionStatus === STATUS_CONNECTED}
        onClick={() => connect()}
      >
        Connect
      </button>
      <span className="status-label">{connectionStatus}</span>
      <hr />
      <textarea
        id="textToPrint"
        rows="3"
        placeholder="Text to print"
        value={textToPrint}
        onChange={(e) => setTextToPrint(e.currentTarget.value)}
      />
      <button onClick={() => print(textToPrint)}
      >
        Print
      </button>
      <canvas></canvas>
      <div className="parent">
        <div ref={exportRef}>
          <p style={{ "color": "red" }}>touqeer is here</p>
        </div>
      </div>
      <button onClick={() => exportAsImage(exportRef.current, "test")}>
        Capture Image
      </button>

    </div>
  );
};

export default ThermalPrinter;


