import React, {Component} from "react";

export default class SignCard extends Component{

    constructor(props) {
        super(props);
        this.state = {
            imgWidth: 0,
            imgHeight: 0,
            signatureRawData: 'Signature Raw Data: ',
            signatureImageData: 'Signature Image Data: ',
        };

        this.startSigning = this.startSigning.bind(this);
        this.SignResponse = this.SignResponse.bind(this);
    }

    startSigning() {
        const canvasObj = document.getElementById('cvs');
        canvasObj.getContext('2d').clearRect(0, 0, canvasObj.width, canvasObj.height);
        // document.FORM1.sigRawData.value = "Signature Raw Data: ";
		// document.FORM1.sigImageData.value = "Signature Image Data: ";
        this.setState({
            signatureRawData: 'Signature Raw Data: ',
            signatureImageData: 'Signature Image Data: ',
            imgWidth: canvasObj.width,
            imgHeight: canvasObj.height,
        });

		const message = { 
            "firstName": "",
            "lastName": "",
            "eMail": "",
            "location": "",
            "imageFormat": 1,
            "imageX": this.state.imgWidth,
            "imageY": this.state.imgHeight,
            "imageTransparency": false,
            "imageScaling": false,
            "maxUpScalePercent": 0.0,
            "rawDataFormat": "ENC",
            "minSigPoints": 25
        };

		document.addEventListener('SigCaptureWeb_SignResponse', this.SignResponse, false);
		const messageData = JSON.stringify(message);
		const element = document.createElement("SigCaptureWeb_ExtnDataElem");
		element.setAttribute("SigCaptureWeb_MsgAttribute", messageData);
		document.documentElement.appendChild(element);
		const evt = document.createEvent("Events");
		evt.initEvent("SigCaptureWeb_SignStartEvent", true, false);				
		element.dispatchEvent(evt);	
    }

    SignResponse(event)
	{
	    const str = event.target.getAttribute("SigCaptureWeb_msgAttri");
		const obj = JSON.parse(str);
		this.SetValues(obj, this.state.imgWidth, this.state.imgHeight);
	}

    SetValues(objResponse, imageWidth, imageHeight)
	{
        const obj = JSON.parse(JSON.stringify(objResponse));
	    const ctx = document.getElementById('cvs').getContext('2d');

        if (obj.errorMsg !== null && obj.errorMsg !== "" && obj.errorMsg !== "undefined")
        {
            alert(obj.errorMsg);
        }
        else
        {
            if (obj.isSigned)
            {
                this.setState({
                    signatureRawData: `${this.state.signatureRawData}: ${obj.rawData}`,
                    signatureImageData: `${this.state.signatureImageData}: ${obj.imageData}`,
                });
                // document.FORM1.sigRawData.value += obj.rawData;
                // document.FORM1.sigImageData.value += obj.imageData;
                const img = new Image();
                img.onload = function () 
                {
                    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
                }
                img.src = "data:image/png;base64," + obj.imageData;
            }
        }
    }

    ClearFormData()
	{
        this.setState({
            signatureRawData: "Signature Raw Data: ",
            signatureImageData: "Signature Image Data: ",
        });
        // document.FORM1.sigRawData.value = "Signature Raw Data: ";
        // document.FORM1.sigImageData.value = "Signature Image Data: ";
	     
	}

    render() {
        return (
            <div className="signature-pad-wrapper">
                <h2 className="header">ePadLink SigCaptureWeb SDK Sample Page</h2>
                <canvas id="cvs" className="signature-pad" width="500" height="100"></canvas>
                <button onClick={this.startSigning} type="button" className="sign-button">Sign</button>
                <div className="signature-data-wrapper">
                    <div className="signature-raw-data">{this.state.signatureRawData}</div>
                    <div className="signature-image-data">{this.state.signatureImageData}</div>
                </div>
            </div>
        );
    }
}