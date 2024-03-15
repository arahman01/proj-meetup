import { MongoClient } from "mongodb";
import React from "react";
import Head from "next/head"; // for adding meta-data

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>MeetupHub</title>
        <meta
          name="description"
          content="Browse a huge list of highly active meetups"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </React.Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    process.env.MONGO_CONNECTION_STRING
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
