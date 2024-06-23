mod connection_handler;

use tokio::net::TcpListener;
use log::{info, error};

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();
    let addr = "127.0.0.1:8080";
    let listener = match TcpListener::bind(addr).await {
        Ok(listener) => {
            info!("Listening on: {}", addr);
            listener
        }
        Err(e) => {
            error!("Failed to bind: {}", e);
            return;
        }
    };

    loop {
        match listener.accept().await {
            Ok((stream, addr)) => {
                tokio::spawn(connection_handler::handle_connection(stream, addr));
            }
            Err(e) => {
                error!("Failed to accept connection: {}", e);
            }
        }
    }
}
