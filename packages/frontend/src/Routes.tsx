import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import Signup from "./containers/Signup.tsx";
import NewSong from "./containers/NewSong.tsx";
import Song from "./containers/Song.tsx";

export default function Links() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/songs/new" element={<NewSong />} />
            <Route path="/songs/:id" element={<Song />} />

            {/* Finally, catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />;
        </Routes>
    );
}