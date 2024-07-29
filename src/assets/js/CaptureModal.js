import { useEffect, useState } from 'react';
import { Constants } from '../../Constants/Constants';

const CaptureModal = ({ capturedImage }) => {

	
	const [image, setImage] = useState(null);
	const [show, setShow] = useState(true);

	useEffect(() => {
		if (!Constants.IsLoggedIn) {
			window.location.reload();
		}
		// camera stream video element
		let on_stream_video = document.querySelector('#camera-stream');
		// flip button element
		let flipBtn = document.querySelector('#flip-btn');
		var canvas = document.querySelector("#canvas");
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		} else {
			flipBtn.style.display = 'none';
		}


		// default user media options
		let constraints = { audio: false, video: true }
		let shouldFaceUser = true;

		// check whether we can use facingMode
		let supports = navigator.mediaDevices.getSupportedConstraints();
		if (supports['facingMode'] === true) {
			flipBtn.disabled = false;
		}

		let stream = null;

		function capture() {
			constraints.video = {
				width: {
					min: 192,
					ideal: 192,
					max: 192,
				},
				height: {
					min: 192,
					ideal: 192,
					max: 192
				},
				facingMode: shouldFaceUser ? 'user' : 'environment'
			}
			navigator.mediaDevices.getUserMedia(constraints)
				.then(function (mediaStream) {
					setShow(true);
					stream = mediaStream;
					on_stream_video.srcObject = stream;
					on_stream_video.play();
				})
				.catch(function (err) {
					console.log(err)
					if (err.toString().includes("Permission denied")) {
						setShow(false);
					}
				});
		}

		flipBtn.addEventListener('click', function () {
			if (stream == null) return
			// we need to flip, stop everything
			stream.getTracks().forEach(t => {
				t.stop();
			});
			// toggle / flip
			shouldFaceUser = !shouldFaceUser;
			capture();
		})

		capture();

		document.getElementById("capture-camera").addEventListener("click", function () {
			// Elements for taking the snapshot
			const video = document.querySelector('video');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			canvas.getContext('2d').drawImage(video, 0, 0);
			let image_data_url = canvas.toDataURL('image/jpeg');
			setImage(image_data_url);
			capturedImage(image_data_url);
		});
		return () => {
			if (stream == null) return

			stream.getTracks().forEach(t => {
				t.stop();
			});
		}
	}, []);
	return (
		<div className="container p-5" align="center">
			{show ?
				<div>
					<div className="">
						<video id="camera-stream" className="border border-5"></video>
					</div>
					<div className="my-2">
						<button disabled id="flip-btn" className="btn btn-sm btn-warning mx-2">
							Flip Camera
						</button>
						<button id="capture-camera" className="btn btn-sm btn-primary mx-2">
							Capture
						</button>
					</div>
					<div className="mt-3">
						<canvas id="canvas" className="">
						</canvas>
					</div>
				</div>
				: <div>{Constants.CameraAccessMessage}</div>}
		</div>

	);
}

export default CaptureModal;

