import socket
from zeroconf import Zeroconf, ServiceInfo
import logging

logger = logging.getLogger(__name__)
zc: Zeroconf | None = None
mdns_info: ServiceInfo | None = None


def get_local_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    finally:
        s.close()


def start_mdns(port: int):
    global zc, mdns_info
    ip = get_local_ip()
    mdns_info = ServiceInfo(
        type_="_decklify._tcp.local.",
        name=f"{socket.gethostname()}._decklify._tcp.local.",
        addresses=[socket.inet_aton(ip)],
        port=port,
    )
    zc = Zeroconf()
    zc.register_service(mdns_info)
    logger.info(f"mDNS: advertising at {ip}:{port}")


def stop_mdns():
    global zc, mdns_info
    if zc and mdns_info:
        zc.unregister_service(mdns_info)
        zc.close()
