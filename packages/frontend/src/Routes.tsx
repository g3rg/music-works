import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import Signup from "./containers/Signup.tsx";
import NewSong from "./containers/NewSong.tsx";
import Song from "./containers/Song.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import SongPlayer from "./containers/SongPlayer.tsx";

export default function Links() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route
                path="/login"
                element={
                    <UnauthenticatedRoute>
                        <Login />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <UnauthenticatedRoute>
                        <Signup />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/songs/new"
                element={
                    <AuthenticatedRoute>
                        <NewSong />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/songs/:id"
                element={
                    <AuthenticatedRoute>
                        <Song />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/songplayer/:id"
                element={
                    <AuthenticatedRoute>
                        <SongPlayer />
                    </AuthenticatedRoute>
                }
            />

            {/* Finally, catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />;
        </Routes>
    );
}