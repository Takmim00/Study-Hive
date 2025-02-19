import { Helmet } from "react-helmet-async";
import AllTutor from "./AllTutor";
import Banner from "./Banner";
import StudySession from "./StudySession";
import Blog from "./Blog";
import StudentSays from "./StudentSays";
import HowWorks from "./HowWorks";



const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Study Hive || Home</title>
            </Helmet>
            <Banner/>
            <StudySession/>
            <AllTutor/>
            <StudentSays/>
            <HowWorks/>
            <Blog/>
        </div>
    );
};

export default Home;