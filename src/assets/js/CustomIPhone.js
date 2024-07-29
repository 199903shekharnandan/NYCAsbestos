import { useEffect, useState } from 'react';
import { Constants } from '../../Constants/Constants';


const CustomIPhone = ({ capturedImage }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!Constants.IsLoggedIn) {
      window.location.reload();
    }
    const video = document.getElementById('video');
    const button = document.getElementById('flip-btn');
    const select = document.getElementById('select');
    let currentStream;
    var camerabtn = document.querySelector("#flip-btn");
    var clickphotoBtn = document.querySelector("#capture-camera");
    var canvas = document.querySelector("#canvas");
    var stream = null;
    var devicetype;
    function stopMediaTracks(stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (/webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      //for Mobiel Device
      camerabtn.innerHTML = "Flip Camera";
      camerabtn.setAttribute("data-device", "mobile Camera");
      camerabtn.setAttribute("data-cameraface", "front");
      devicetype = "mobile Camera";
      camerabtn.disabled = false;
      select.style.display = 'none';
      function streamvideo(cameraface) {
        //debugger;
        stream = null;
        var constraints;
        if (devicetype === "desktop Camera") {
          constraints = {
            audio: false,
            video: true
          }
        }
        else {
          constraints = {
            audio: false,
            video: { facingMode: "user" }
          }
          if (cameraface === "back") {
            camerabtn.setAttribute("data-cameraface", "front");
            constraints = {
              audio: false,
              video: {
                facingMode: "environment"
              }
            }
          }
          else {
            camerabtn.setAttribute("data-cameraface", "back");
          }
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          video.srcObject = stream;
        }).catch((err) => {
          console.log(err);
          if (err.toString().includes("NotAllowedError")) {
            setShow(false);
          }
        });

        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
      }
      streamvideo();
      camerabtn.addEventListener('click', async function (e) {
        streamvideo(e.target.dataset.cameraface);
      });
      clickphotoBtn.addEventListener('click', function () {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        capturedImage(image_data_url);
      }); 
    } else {
      function gotDevices(mediaDevices) {
        let selectdevicevalue = select.value;
        select.innerHTML = '';
        select.appendChild(document.createElement('option'));
        document.getElementById("select").options[0].remove();
        let count = 1;
        mediaDevices.forEach(mediaDevice => {
          if (mediaDevice.kind === 'videoinput') {
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || `Camera ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            select.appendChild(option);
          }
        });
        if (selectdevicevalue) {
          document.getElementById("select").value = selectdevicevalue;
        }

      }
      button.addEventListener('click', event => {
        if (typeof currentStream !== 'undefined') {
          stopMediaTracks(currentStream);
        }
        const videoConstraints = {};
        if (select.value === '') {
          videoConstraints.facingMode = 'environment';
        } else {

          videoConstraints.deviceId = { exact: select.value };
        }
        const constraints = {
          video: videoConstraints,
          audio: false
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            return navigator.mediaDevices.enumerateDevices();
          })
          .then(gotDevices)
          .catch(error => {
            console.error(error);
          });
      });

      navigator.mediaDevices.enumerateDevices().then(gotDevices);
      clickphotoBtn.addEventListener('click', function () {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        capturedImage(image_data_url);
      });
    }
    return () => {
      if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
      }
      currentStream = null;
      //Ios 
      stream = null;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

  }, []);

  return (
    <div>
      {show ?
        <div className='video-content'>
          <video id="video" autoPlay={true}></video>
          <div className="camera-button-elements my-2">
            <select id='select' className='form-select mb-3'></select>
            <button className="btn btn-sm btn-warning mx-2" id="flip-btn" data-device="mobile Camera">Start</button>
            <button className="btn btn-sm btn-primary" id="capture-camera">Click Photo</button>
          </div>
          <div id="dataurl-container">
            <canvas id="canvas" width="192" height="192"></canvas>
          </div>

        </div> : <div>{Constants.CameraAccessMessage}</div>}
    </div>
  );
}

export default CustomIPhone;

