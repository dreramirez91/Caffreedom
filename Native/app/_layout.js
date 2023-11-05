// This file is used to add providers, such as Redux, into the app, which can be accessed by any route in the app.
// Compare App.js in traditional React Native projects

import { Slot } from 'expo-router';
import Footer from '../components/Footer'

export default function appLayout() {
    return (
    <>
        <Slot/>
        <Footer/>
    </>
    )
}
