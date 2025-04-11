---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

{% include base_path %}

## Autonomous Evolutionary AI-Based Smart Sensing Platform for Levee Failures (MANTA)

An AI-based system development project for early detection and prediction of levee failures. This project focuses on creating accurate water level forecasting models that can operate effectively even in locations with limited historical data.

- **MANTA Model Development**: Designed and implemented the MANTA (Multivariate Adaptive Network for Temporal Analysis) model for short-term water level forecasting
- **Heterogeneous Data Handling**: Developed techniques to address non-uniform data distribution across different river monitoring stations
- **Performance**: Achieved prediction accuracy of less than 5cm error for 1-hour ahead forecasts during rainfall events
- **Early Warning System Integration**: Integrated forecasting models with alert systems for proactive flood management

## Construction Domain-Optimized LLM with RAG System (Construct-RAG)

A project to develop a Retrieval-Augmented Generation (RAG) system specialized for the construction industry. I built a system capable of answering construction-specific technical queries with high accuracy.

- **Dataset Creation and Preprocessing**: Generated comprehensive training datasets utilizing construction specifications and technical documents
- **Embedding Model Fine-tuning**: Modified loss functions and optimized learning methods to better capture technical relationships in construction documents
- **Performance Benchmarking**: Achieved performance exceeding OpenAI's commercial text-embedding-3-large model
- **System Integration**: Integrated the fine-tuned embedding model into a complete RAG system with vector database storage

## Eugene Concrete Slump Prediction Framework Development

![Concrete Slump Prediction System](/images/Slump_Prediction.png)

A framework development project for automatically monitoring and predicting the quality of concrete produced in factories. Concrete slump value is a critical indicator of workability and quality, and I built a system to analyze this in real-time.

- **Optical Flow-Based Data Acquisition System**: Developed a program that automatically saves footage only when concrete enters the camera frame in a factory environment
- **User-Friendly Interface**: Created a GUI application using PyQt and Docker that can be easily used by non-experts
- **Deep Learning Model Implementation**: Trained and optimized CNN models for visual recognition of concrete properties
- **Real Environment Deployment**: Successfully deployed the system in operational concrete batching plants

## Robot-Based Automated Vane Testing System for Material Rheology

A research project utilizing ABB robot technology to automate vane testing for precise rheological measurements of construction materials. The system combines computer vision and robotics to identify testing points and execute controlled rotational movements.

- **Computer Vision Integration**: Implemented end-effector camera and depth sensor systems to detect materials and testing points autonomously
- **Robot Programming**: Developed code for the ABB robot to perform precise, consistent rotational movements required for vane testing
- **Rheological Measurement**: Created a system that maintains constant rotation speed for accurate determination of material properties
- **Automation Workflow**: Designed the end-to-end process from material detection to data collection and analysis

