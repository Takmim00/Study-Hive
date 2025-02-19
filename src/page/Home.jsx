import { Helmet } from "react-helmet-async";
import AllTutor from "./AllTutor";
import Banner from "./Banner";
import StudySession from "./StudySession";
import Blog from "./Blog";
import StudentSays from "./StudentSays";
import HowWorks from "./HowWorks";
import Faq from "./Faq";



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
            <Faq/>
        </div>
    );
};

export default Home;