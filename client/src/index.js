import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";

const { Search } = Input;
const { Text } = Typography;
const client = new W3CWebSocket("ws://localhost:8080");

export const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [message, setMessages] = useState([]);

	// Connect to the websocket server on
	client.onopen = () => {
		client.send(
			JSON.stringify({
				identifier: "notice",
				user: "asdasda98asugkasud",
			})
		);
		console.log("Connected to websocket");
	};

	useEffect(() => {
		client.onmessage = (msg) => {
			console.log(msg);
			const dataFromServer = JSON.parse(msg.data);
			console.log(`FROM SERVER:`, dataFromServer);
			if (dataFromServer.type === "message") {
				setMessages((message) => [...message, { msg: dataFromServer.msg, user: dataFromServer.user }]);
			}
		};
	}, []);

	const onClickHandler = (val) => {
		// using the client
		// send the message as
		// a json object with type message
		// with the following params:
		// message : the message we want to send
		// user: the username of the user
		client.send(
			JSON.stringify({
				type: "message",
				msg: val,
				user: username,
			})
		);
	};

	const joinChatHandler = (val) => {
		setIsLoggedIn(true);
		setUsername(val);
	};
	return (
		<div className='main'>
			{isLoggedIn ? (
				<div>
					<div className='title'>
						<Text type='secondary' style={{ fontSize: "37px" }}>
							Appliance Communicator
						</Text>
					</div>
					<div style={{ display: "flex", flexDirection: "column", paddingBottom: "50px" }}>
						{message.map((msg) => (
							<p
								style={{
									color: "white",
									backgroundColor: `${username === msg.user ? "green" : "blue"}`,
									textAlign: `${username === msg.user ? "right" : "left"}`,
								}}
							>
								<span style={{ fontSize: "20px" }}>{msg.msg}</span>
								<br />
								<span style={{ fontSize: "10px" }}>{msg.user}</span>
							</p>
						))}
					</div>
					<div className='bottom'>
						<Search
							placeholder='Message'
							enterButton='Send'
							// value={this.state.searchVal}
							size='large'
							// onChange={(e) => this.setState({ searchVal: e.target.value })}
							onSearch={(value) => onClickHandler(value)}
						/>
					</div>
					{/* <button onClick={() => onClickHandler("Hello!")}>Send Message</button>
					{message.map((msg) => (
						<p>
							msg: {msg.msg},user:{msg.user}
						</p>
					))}
					{console.log("msgs:", message)} */}
				</div>
			) : (
				<div style={{ padding: "200px 40px" }}>
					<Search
						placeholder='Enter Name:'
						enterButton='Login'
						size='large'
						onSearch={(value) => joinChatHandler(value)}
					/>
				</div>
			)}
		</div>
	);
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
