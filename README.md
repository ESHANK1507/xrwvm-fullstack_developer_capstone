# Best Cars Dealership — Full Stack Developer Capstone Project

## Project Overview

**Best Cars Dealership** is a full-stack cloud-native web application built for the IBM Full Stack Software Developer Capstone Project. It enables customers across North America to browse car dealership branches, filter dealers by state, view verified customer reviews with automated sentiment analysis, register and authenticate accounts, and submit new dealership reviews.

## Architecture & Tech Stack

- **Front-End:** HTML5, CSS3, Bootstrap 5, JavaScript, and React (`server/frontend`)
- **Back-End Web Framework:** Python & Django (`server/djangoproj`, `server/djangoapp`) with SQLite for Car Make / Car Model catalog and user authentication
- **Dealerships & Reviews Microservice:** Node.js, Express.js, and MongoDB with Mongoose (`server/database`)
- **Sentiment Analysis Microservice:** Python, Flask, and NLTK VADER Sentiment Analyzer (`server/djangoapp/microservices`)
- **CI/CD & Containerization:** GitHub Actions (`flake8` + `jshint`), Docker, and Kubernetes deployment manifests

## Key Features

- Static informational pages: **Home**, **About Us**, and **Contact Us**
- User **Registration**, **Login**, and **Logout** powered by Django authentication
- **Django Admin** management for `CarMake` and `CarModel` records
- **Dealership Directory** with live filtering by U.S. state (e.g., Kansas, Texas, California)
- **Dealer Details & Reviews** with real-time Positive / Neutral / Negative sentiment indicators
- **Post Review** workflow for authenticated users
- Automated **GitHub Actions CI/CD** pipeline validating Python and JavaScript code quality
