
"use client"
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Loader from "./Loader"; // Import a loader component (optional)

async function fetchCharacters() {
  try {
    const res = await fetch("http://192.168.0.157:8000/docs"); // Replace with actual data endpoint
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    return []; // Return an empty array to prevent errors during rendering
  }
}

export default async function Home() {
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCharacters();
        setFetchedData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <Loader /> // Optional loader component
      ) : error ? (
        <div>Error fetching data: {error.message}</div>
      ) : (
        <>
          <h1>Data fetched at build time:</h1>
          <div className={styles.cardContainer}>
            {fetchedData.map((character, index) => (
              <div key={index} className={styles.card}>
                <h2>{character.page}</h2>
                <p>
                  <strong>Page Size:</strong> {character.page_size || "Unknown"}
                </p>
                <p>
                  <strong>Minimum Page Price:</strong>{" "}
                  {character.min_price !== undefined ? character.min_price : "Unknown"}
                </p>
                <p>
                  <strong>Maximum Page Price:</strong>{" "}
                  {character.max_price !== undefined ? character.max_price : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}