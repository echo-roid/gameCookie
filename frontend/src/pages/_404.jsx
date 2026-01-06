import { useState, useEffect } from 'react';

export function NotFound() {

	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
		setRotation(prev => (prev + 1) % 360);
		}, 50);
		return () => clearInterval(timer);
	}, []);

	return (
		<>
		<div className="container p-4">
			<div className="floating-shapes">
				<div className="shape shape-1"><i className="fas fa-gamepad"></i></div>
				<div className="shape shape-2"><i className="fas fa-ghost"></i></div>
				<div className="shape shape-3"><i className="fas fa-puzzle-piece"></i></div>
				<div className="shape shape-4"><i className="fas fa-trophy"></i></div>
			</div>

			<div className="not-found-content">
				<h1 className="error-code">404</h1>
				<div className="error-icon" style={{ transform: `rotate(${rotation}deg)` }}>
				<i className="fas fa-gamepad"></i>
				</div>
				<h2 className="error-title">Game Over!</h2>
				<p className="error-message">
				Oops! The page you're looking for has wandered off into another dimension. 
				Looks like you've hit a dead end in this level!
				</p>

				<button className="home-btn" onClick={() => window.location.href = '/'}>
				<i className="fas fa-home"></i>
				Return to Home
				</button>
			</div>
		</div>
	</>
	);
}
