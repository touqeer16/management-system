
return (
    <html>
        <head>
            <meta charset="utf-8" />
            <title>TITLE</title>
            <script type="text/javascript" src="../ePOS-Print_SDK/ePOS-Print_SDK_150729E/JavaScript/epos-print-5.0.0.js"></script>
            <script type="text/javascript">
                function buildMessage() {
             //Create an ePOS-Print Builder object
             var builder = new epson.ePOSBuilder();
                //Create a print document
                builder.addTextLang('en')
                builder.addTextSmooth(true);
                builder.addTextFont(builder.FONT_A);
                builder.addTextSize(3, 3);
                builder.addText('Hello,\tWorld!\n');
                builder.addCut(builder.CUT_FEED);
                //Acquire the print document
                var request = builder.toString();
                var address = 'http://192.168.1.65/cgi-bin/epos/service.cgi?devid=99&timeout=1000';
                //Create an ePOS-Print object
                var epos = new epson.ePOSPrint(address);
                epos.onreceive = function (res) {
             //When the printing is not successful, display a message
             if (!res.success) {
                    alert('A print error occurred');
                }
             }
                //Send the print document
                epos.send(request);
         }
            </script>
        </head>
        <body>
            <button onclick='buildMessage()'>Run</button>
        </body>
    </html>
);