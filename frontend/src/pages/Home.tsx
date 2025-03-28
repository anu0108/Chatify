
import MessageContainer from "../components/MessageContainer";
import Sidebar from "../components/Sidebar";

const Home = () => {
    
    return (
        <div className="flex w-full h-screen p-0.5">
            <Sidebar />
            <MessageContainer />
        </div>
    )
}

export default Home