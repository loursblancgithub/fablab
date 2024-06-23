use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use futures::stream::StreamExt;
use futures::SinkExt;
use log::{info, error};
use tokio::time::{timeout, Duration};

pub async fn handle_connection(stream: tokio::net::TcpStream, addr: std::net::SocketAddr) {
    info!("Incoming TCP connection from: {}", addr);

    let ws_stream = match accept_async(stream).await {
        Ok(ws_stream) => {
            info!("WebSocket connection established: {}", addr);
            ws_stream
        }
        Err(e) => {
            error!("Error during the websocket handshake occurred: {}", e);
            return;
        }
    };

    let (mut write, mut read) = ws_stream.split();

    if let Err(e) = write.send(Message::Text("Welcome!".to_string())).await {
        error!("Error sending welcome message: {}", e);
        return;
    }

    loop {
        match timeout(Duration::from_secs(60), read.next()).await {
            Ok(Some(Ok(msg))) => {
                if let Ok(text) = msg.to_text() {
                    info!("Received a message: {}", text);
                } else {
                    info!("Received a binary message");
                }
            }
            Ok(Some(Err(e))) => {
                error!("Error while receiving message: {}", e);
                break;
            }
            Ok(None) => {
                info!("Connection closed by client");
                break;
            }
            Err(_) => {
                info!("Connection timed out, sending heartbeat");
                if let Err(e) = write.send(Message::Ping(vec![])).await {
                    error!("Error sending heartbeat: {}", e);
                    break;
                }
            }
        }
    }

    if let Err(e) = write.send(Message::Close(None)).await {
        error!("Error sending close message: {}", e);
    }
    info!("WebSocket connection closed: {}", addr);
}
