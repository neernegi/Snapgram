import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import { Toaster } from "./components/ui/toaster";
import ConfirmSignup from "./components/forms/ConfirmSignupForm";
// import RootLayout from "./_root/RootLayout";
import { AllUsers, CreatePost, EditPost, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
// import {
//   AllUsers,
//   CreatePost,
//   EditPost,
//   Home,
//   PostDetails,
//   Profile,
//   Saved,
//   UpdateProfile,
// } from "./_root/pages";

export default function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/confirm-signup" element={<ConfirmSignup />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

{
  /* <Route element={<RootLayout />}>
          <Route index element={<Home />} />

          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route> */
}
{
  /* <Route element={<RootLayout />}>
        <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route> */
}
