import { Server } from "socket.io";
import { getBattery, getCPU, getMemory, getStorage } from "../services/sys";

const sysInterval = async (io: Server) => {
    io.to('interval-sys').emit('interval-sys', {
        cpu: await getCPU(),
        memory: await getMemory(),
        storage: await getStorage(),
        battery: await getBattery(),
    });
}

export default sysInterval;