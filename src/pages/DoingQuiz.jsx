import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Data & Helpers---
const questionBank = [
       { topic: "Sports", question: "How many players are on a standard soccer (football) team on the field at one time?", image: null, name: "Soccer Team Size", answers: [ { id: 'A', text: '9', color: 'blue' }, { id: 'B', text: '10', color: 'pink' }, { id: 'C', text: '11', color: 'green' }, { id: 'D', text: '12', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "In which sport would you perform an 'alley-oop'?", image: null, name: "Basketball Maneuver", answers: [ { id: 'A', text: 'Volleyball', color: 'blue' }, { id: 'B', text: 'Basketball', color: 'pink' }, { id: 'C', text: 'Tennis', color: 'green' }, { id: 'D', text: 'Ice Hockey', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "How many rounds are there in a standard professional boxing match?", image: null, name: "Boxing Rounds", answers: [ { id: 'A', text: '10', color: 'blue' }, { id: 'B', text: '15', color: 'pink' }, { id: 'C', text: '12', color: 'green' }, { id: 'D', text: '8', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which country hosted the 2016 Summer Olympics?", image: null, name: "2016 Olympics Host", answers: [ { id: 'A', text: 'China', color: 'blue' }, { id: 'B', text: 'Brazil', color: 'pink' }, { id: 'C', text: 'United Kingdom', color: 'green' }, { id: 'D', text: 'Japan', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "What is the term for a score of three strikes in a row in bowling?", image: null, name: "Bowling Term", answers: [ { id: 'A', text: 'Spare', color: 'blue' }, { id: 'B', text: 'Double', color: 'pink' }, { id: 'C', text: 'Eagle', color: 'green' }, { id: 'D', text: 'Turkey', color: 'yellow' } ], correct: 'D' },
       { topic: "Sports", question: "In tennis, what score comes after Deuce?", image: null, name: "Tennis Scoring", answers: [ { id: 'A', text: 'Game', color: 'blue' }, { id: 'B', text: 'Advantage', color: 'pink' }, { id: 'C', text: '15', color: 'green' }, { id: 'D', text: 'Set Point', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "Which martial art is known as 'the way of the foot and fist'?", image: null, name: "Martial Art Origin", answers: [ { id: 'A', text: 'Judo', color: 'blue' }, { id: 'B', text: 'Karate', color: 'pink' }, { id: 'C', text: 'Taekwondo', color: 'green' }, { id: 'D', text: 'Aikido', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "What is the diameter of a standard basketball hoop in inches?", image: null, name: "Basketball Hoop Size", answers: [ { id: 'A', text: '16 inches', color: 'blue' }, { id: 'B', text: '20 inches', color: 'pink' }, { id: 'C', text: '18 inches', color: 'green' }, { id: 'D', text: '22 inches', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which legendary swimmer won 23 Olympic gold medals?", image: null, name: "Olympic Swimmer", answers: [ { id: 'A', text: 'Mark Spitz', color: 'blue' }, { id: 'B', text: 'Michael Phelps', color: 'pink' }, { id: 'C', text: 'Ian Thorpe', color: 'green' }, { id: 'D', text: 'Ryan Lochte', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "How long is a marathon race?", image: null, name: "Marathon Distance", answers: [ { id: 'A', text: '26.2 miles (42.195 km)', color: 'blue' }, { id: 'B', text: '25 miles (40.23 km)', color: 'pink' }, { id: 'C', text: '30 miles (48.28 km)', color: 'green' }, { id: 'D', text: '20 miles (32.19 km)', color: 'yellow' } ], correct: 'A' },
       { topic: "Sports", question: "In American football, how many points is a touchdown worth before the extra point attempt?", image: null, name: "Touchdown Points", answers: [ { id: 'A', text: '3', color: 'blue' }, { id: 'B', text: '7', color: 'pink' }, { id: 'C', text: '6', color: 'green' }, { id: 'D', text: '2', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which piece cannot move backward in a standard game of Chess?", image: null, name: "Chess Movement", answers: [ { id: 'A', text: 'King', color: 'blue' }, { id: 'B', text: 'Knight', color: 'pink' }, { id: 'C', text: 'Rook', color: 'green' }, { id: 'D', text: 'Pawn', color: 'yellow' } ], correct: 'D' },
       { topic: "Sports", question: "What is the name of the trophy awarded to the winner of the NHL playoffs?", image: null, name: "NHL Trophy", answers: [ { id: 'A', text: "Commissioner's Trophy", color: 'blue' }, { id: 'B', text: 'Stanley Cup', color: 'pink' }, { id: 'C', text: 'Vince Lombardi Trophy', color: 'green' }, { id: 'D', text: "Larry O'Brien Trophy", color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "Which Grand Slam tennis tournament is played on clay courts?", image: null, name: "Tennis Surface", answers: [ { id: 'A', text: 'Wimbledon', color: 'blue' }, { id: 'B', text: 'US Open', color: 'pink' }, { id: 'C', text: 'French Open (Roland Garros)', color: 'green' }, { id: 'D', text: 'Australian Open', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "How many holes are there on a standard golf course?", image: null, name: "Golf Course Holes", answers: [ { id: 'A', text: '9', color: 'blue' }, { id: 'B', text: '12', color: 'pink' }, { id: 'C', text: '18', color: 'green' }, { id: 'D', text: '27', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "In baseball, how many innings are in a standard game?", image: null, name: "Baseball Innings", answers: [ { id: 'A', text: '7', color: 'blue' }, { id: 'B', text: '9', color: 'pink' }, { id: 'C', text: '10', color: 'green' }, { id: 'D', text: '8', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "What country is cricket most popular in?", image: null, name: "Cricket Popularity", answers: [ { id: 'A', text: 'United States', color: 'blue' }, { id: 'B', text: 'Canada', color: 'pink' }, { id: 'C', text: 'India', color: 'green' }, { id: 'D', text: 'Brazil', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which Formula 1 driver holds the record for the most World Championships (as of early 2025)?", image: null, name: "F1 Championships", answers: [ { id: 'A', text: 'Ayrton Senna', color: 'blue' }, { id: 'B', text: 'Michael Schumacher & Lewis Hamilton', color: 'pink' }, { id: 'C', text: 'Sebastian Vettel', color: 'green' }, { id: 'D', text: 'Max Verstappen', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "What is the term for a perfect score of 10 in gymnastics?", image: null, name: "Gymnastics Score", answers: [ { id: 'A', text: 'Ace', color: 'blue' }, { id: 'B', text: 'Perfect 10', color: 'pink' }, { id: 'C', text: 'Flawless', color: 'green' }, { id: 'D', text: 'Gold Standard', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "How many players are on a standard volleyball team on the court?", image: null, name: "Volleyball Team Size", answers: [ { id: 'A', text: '5', color: 'blue' }, { id: 'B', text: '7', color: 'pink' }, { id: 'C', text: '6', color: 'green' }, { id: 'D', text: '8', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which sport uses the terms 'birdie', 'eagle', and 'albatross'?", image: null, name: "Scoring Terms", answers: [ { id: 'A', text: 'Tennis', color: 'blue' }, { id: 'B', text: 'Golf', color: 'pink' }, { id: 'C', text: 'Bowling', color: 'green' }, { id: 'D', text: 'Archery', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "What type of race is the Tour de France?", image: null, name: "Tour de France Type", answers: [ { id: 'A', text: 'Running race', color: 'blue' }, { id: 'B', text: 'Swimming race', color: 'pink' }, { id: 'C', text: 'Cycling race', color: 'green' }, { id: 'D', text: 'Motorsport race', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "In rugby union, how many points is a try worth?", image: null, name: "Rugby Try Points", answers: [ { id: 'A', text: '3', color: 'blue' }, { id: 'B', text: '5', color: 'pink' }, { id: 'C', text: '7', color: 'green' }, { id: 'D', text: '4', color: 'yellow' } ], correct: 'B' },
       { topic: "Sports", question: "What is the object hit back and forth in badminton?", image: null, name: "Badminton Object", answers: [ { id: 'A', text: 'Ball', color: 'blue' }, { id: 'B', text: 'Puck', color: 'pink' }, { id: 'C', text: 'Shuttlecock (or Birdie)', color: 'green' }, { id: 'D', text: 'Disc', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which athletics event involves throwing a heavy metal ball?", image: null, name: "Throwing Event", answers: [ { id: 'A', text: 'Javelin Throw', color: 'blue' }, { id: 'B', text: 'Discus Throw', color: 'pink' }, { id: 'C', text: 'Hammer Throw', color: 'green' }, { id: 'D', text: 'Shot Put', color: 'yellow' } ], correct: 'D' },
       { topic: "Sports", question: "How many periods are there in an ice hockey game?", image: null, name: "Ice Hockey Periods", answers: [ { id: 'A', text: '2', color: 'blue' }, { id: 'B', text: '4', color: 'pink' }, { id: 'C', text: '3', color: 'green' }, { id: 'D', text: '5', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "What does 'FIFA' stand for in the context of soccer?", image: null, name: "FIFA Acronym", answers: [ { id: 'A', text: 'Federation of International Football Associations', color: 'blue' }, { id: 'B', text: 'Federal International Football Authority', color: 'pink' }, { id: 'C', text: 'Football Institute For All', color: 'green' }, { id: 'D', text: 'Federation of Independent Football Allies', color: 'yellow' } ], correct: 'A' },
       { topic: "Sports", question: "What do the five Olympic rings represent?", image: null, name: "Olympic Rings Meaning", answers: [ { id: 'A', text: 'The five types of Olympic sports', color: 'blue' }, { id: 'B', text: 'The five major participating countries', color: 'pink' }, { id: 'C', text: 'The five inhabited continents', color: 'green' }, { id: 'D', text: 'The five original Olympic values', color: 'yellow' } ], correct: 'C' },
       { topic: "Sports", question: "Which swimming stroke is performed on the back?", image: null, name: "Swimming Stroke", answers: [ { id: 'A', text: 'Freestyle', color: 'blue' }, { id: 'B', text: 'Butterfly', color: 'pink' }, { id: 'C', text: 'Breaststroke', color: 'green' }, { id: 'D', text: 'Backstroke', color: 'yellow' } ], correct: 'D' },
       { topic: "Sports", question: "What is the maximum number of clubs a golfer can carry in their bag during a round?", image: null, name: "Golf Club Limit", answers: [ { id: 'A', text: '12', color: 'blue' }, { id: 'B', text: '14', color: 'pink' }, { id: 'C', text: '16', color: 'green' }, { id: 'D', text: 'Unlimited', color: 'yellow' } ], correct: 'B' },
       // --- Science Questions (30) ---
       { topic: "Science", question: "What is the chemical symbol for Water?", image: null, name: "Water Molecule Symbol", answers: [ { id: 'A', text: 'O2', color: 'blue' }, { id: 'B', text: 'CO2', color: 'pink' }, { id: 'C', text: 'H2O', color: 'green' }, { id: 'D', text: 'NaCl', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What planet is known as the 'Red Planet'?", image: null, name: "Red Planet", answers: [ { id: 'A', text: 'Jupiter', color: 'blue' }, { id: 'B', text: 'Mars', color: 'pink' }, { id: 'C', text: 'Venus', color: 'green' }, { id: 'D', text: 'Saturn', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What force pulls objects towards the center of the Earth?", image: null, name: "Fundamental Force", answers: [ { id: 'A', text: 'Magnetism', color: 'blue' }, { id: 'B', text: 'Friction', color: 'pink' }, { id: 'C', text: 'Gravity', color: 'green' }, { id: 'D', text: 'Inertia', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the largest organ in the human body?", image: null, name: "Largest Human Organ", answers: [ { id: 'A', text: 'Liver', color: 'blue' }, { id: 'B', text: 'Brain', color: 'pink' }, { id: 'C', text: 'Skin', color: 'green' }, { id: 'D', text: 'Lungs', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What gas do plants absorb from the atmosphere during photosynthesis?", image: null, name: "Photosynthesis Input", answers: [ { id: 'A', text: 'Oxygen (O2)', color: 'blue' }, { id: 'B', text: 'Nitrogen (N2)', color: 'pink' }, { id: 'C', text: 'Carbon Dioxide (CO2)', color: 'green' }, { id: 'D', text: 'Hydrogen (H2)', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the chemical symbol for Gold?", image: null, name: "Gold Symbol", answers: [ { id: 'A', text: 'Go', color: 'blue' }, { id: 'B', text: 'Ag', color: 'pink' }, { id: 'C', text: 'Au', color: 'green' }, { id: 'D', text: 'Gd', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the powerhouse of the cell?", image: null, name: "Cellular Organelle", answers: [ { id: 'A', text: 'Nucleus', color: 'blue' }, { id: 'B', text: 'Ribosome', color: 'pink' }, { id: 'C', text: 'Mitochondrion', color: 'green' }, { id: 'D', text: 'Cell Membrane', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "How many planets are in our Solar System?", image: null, name: "Solar System Planets", answers: [ { id: 'A', text: '7', color: 'blue' }, { id: 'B', text: '9', color: 'pink' }, { id: 'C', text: '8', color: 'green' }, { id: 'D', text: '10', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the hardest natural substance on Earth?", image: null, name: "Hardest Substance", answers: [ { id: 'A', text: 'Gold', color: 'blue' }, { id: 'B', text: 'Iron', color: 'pink' }, { id: 'C', text: 'Diamond', color: 'green' }, { id: 'D', text: 'Quartz', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the process by which water changes from a liquid to a gas or vapor?", image: null, name: "Phase Change", answers: [ { id: 'A', text: 'Condensation', color: 'blue' }, { id: 'B', text: 'Freezing', color: 'pink' }, { id: 'C', text: 'Evaporation', color: 'green' }, { id: 'D', text: 'Sublimation', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What measurement scale is used to determine the acidity or alkalinity of a substance?", image: null, name: "Acidity Scale", answers: [ { id: 'A', text: 'Richter Scale', color: 'blue' }, { id: 'B', text: 'pH Scale', color: 'pink' }, { id: 'C', text: 'Celsius Scale', color: 'green' }, { id: 'D', text: 'Kelvin Scale', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What type of star is the Sun?", image: null, name: "Sun Classification", answers: [ { id: 'A', text: 'Red Giant', color: 'blue' }, { id: 'B', text: 'White Dwarf', color: 'pink' }, { id: 'C', text: 'G-type main-sequence star (Yellow Dwarf)', color: 'green' }, { id: 'D', text: 'Blue Supergiant', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the study of earthquakes called?", image: null, name: "Earthquake Study", answers: [ { id: 'A', text: 'Meteorology', color: 'blue' }, { id: 'B', text: 'Volcanology', color: 'pink' }, { id: 'C', text: 'Seismology', color: 'green' }, { id: 'D', text: 'Paleontology', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "Which element has the chemical symbol 'O'?", image: null, name: "Element Symbol O", answers: [ { id: 'A', text: 'Osmium', color: 'blue' }, { id: 'B', text: 'Oxygen', color: 'pink' }, { id: 'C', text: 'Gold (Aurum)', color: 'green' }, { id: 'D', text: 'Sodium (Natrium)', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What part of the plant conducts photosynthesis?", image: null, name: "Photosynthesis Location", answers: [ { id: 'A', text: 'Roots', color: 'blue' }, { id: 'B', text: 'Stem', color: 'pink' }, { id: 'C', text: 'Leaves', color: 'green' }, { id: 'D', text: 'Flower', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What natural satellite orbits the Earth?", image: null, name: "Earth's Satellite", answers: [ { id: 'A', text: 'The Sun', color: 'blue' }, { id: 'B', text: 'Mars', color: 'pink' }, { id: 'C', text: 'The Moon', color: 'green' }, { id: 'D', text: 'International Space Station', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "Sound waves travel fastest through which medium?", image: null, name: "Speed of Sound", answers: [ { id: 'A', text: 'Air', color: 'blue' }, { id: 'B', text: 'Water', color: 'pink' }, { id: 'C', text: 'Steel', color: 'green' }, { id: 'D', text: 'Vacuum', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the common name for Sodium Chloride?", image: null, name: "Sodium Chloride", answers: [ { id: 'A', text: 'Sugar', color: 'blue' }, { id: 'B', text: 'Vinegar', color: 'pink' }, { id: 'C', text: 'Table Salt', color: 'green' }, { id: 'D', text: 'Baking Soda', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "Which gas makes up the majority of the Earth's atmosphere?", image: null, name: "Atmospheric Composition", answers: [ { id: 'A', text: 'Oxygen', color: 'blue' }, { id: 'B', text: 'Carbon Dioxide', color: 'pink' }, { id: 'C', text: 'Nitrogen', color: 'green' }, { id: 'D', text: 'Argon', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What is the boiling point of water in Celsius at standard atmospheric pressure?", image: null, name: "Water Boiling Point (C)", answers: [ { id: 'A', text: '0°C', color: 'blue' }, { id: 'B', text: '90°C', color: 'pink' }, { id: 'C', text: '100°C', color: 'green' }, { id: 'D', text: '212°C', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What theory explains the origin of the universe from a single point?", image: null, name: "Universe Origin Theory", answers: [ { id: 'A', text: 'String Theory', color: 'blue' }, { id: 'B', text: 'Theory of Relativity', color: 'pink' }, { id: 'C', text: 'Big Bang Theory', color: 'green' }, { id: 'D', text: 'Quantum Mechanics', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "Which type of lens is used to correct nearsightedness (myopia)?", image: null, name: "Lens Correction", answers: [ { id: 'A', text: 'Convex Lens', color: 'blue' }, { id: 'B', text: 'Concave Lens', color: 'pink' }, { id: 'C', text: 'Bifocal Lens', color: 'green' }, { id: 'D', text: 'Cylindrical Lens', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What does DNA stand for?", image: null, name: "DNA Acronym", answers: [ { id: 'A', text: 'Deoxyribonucleic Acid', color: 'blue' }, { id: 'B', text: 'Dyoxynucleic Acid', color: 'pink' }, { id: 'C', text: 'Diribonucleic Acid', color: 'green' }, { id: 'D', text: 'Deoxyribonuclear Acid', color: 'yellow' } ], correct: 'A' },
       { topic: "Science", question: "What is the unit of electrical resistance?", image: null, name: "Electrical Resistance Unit", answers: [ { id: 'A', text: 'Volt (V)', color: 'blue' }, { id: 'B', text: 'Ampere (A)', color: 'pink' }, { id: 'C', text: 'Ohm (Ω)', color: 'green' }, { id: 'D', text: 'Watt (W)', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "Which kingdom do mushrooms belong to?", image: null, name: "Mushroom Kingdom", answers: [ { id: 'A', text: 'Plantae', color: 'blue' }, { id: 'B', text: 'Animalia', color: 'pink' }, { id: 'C', text: 'Fungi', color: 'green' }, { id: 'D', text: 'Protista', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "What phenomenon causes the seasons on Earth?", image: null, name: "Cause of Seasons", answers: [ { id: 'A', text: "Earth's distance from the Sun", color: 'blue' }, { id: 'B', text: "Earth's axial tilt", color: 'pink' }, { id: 'C', text: "The Moon's gravitational pull", color: 'green' }, { id: 'D', text: 'Changes in solar radiation', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What is the speed of light in a vacuum (approximately)?", image: null, name: "Speed of Light", answers: [ { id: 'A', text: '300,000 km/s', color: 'blue' }, { id: 'B', text: '150,000 km/s', color: 'pink' }, { id: 'C', text: '3,000,000 km/s', color: 'green' }, { id: 'D', text: '30,000 km/s', color: 'yellow' } ], correct: 'A' },
       { topic: "Science", question: "What metal is liquid at standard room temperature?", image: null, name: "Liquid Metal", answers: [ { id: 'A', text: 'Lead', color: 'blue' }, { id: 'B', text: 'Mercury', color: 'pink' }, { id: 'C', text: 'Aluminum', color: 'green' }, { id: 'D', text: 'Gallium', color: 'yellow' } ], correct: 'B' },
       { topic: "Science", question: "What is the study of fossils called?", image: null, name: "Fossil Study", answers: [ { id: 'A', text: 'Archaeology', color: 'blue' }, { id: 'B', text: 'Geology', color: 'pink' }, { id: 'C', text: 'Paleontology', color: 'green' }, { id: 'D', text: 'Anthropology', color: 'yellow' } ], correct: 'C' },
       { topic: "Science", question: "How many hearts does an octopus have?", image: null, name: "Octopus Hearts", answers: [ { id: 'A', text: '1', color: 'blue' }, { id: 'B', text: '2', color: 'pink' }, { id: 'C', text: '3', color: 'green' }, { id: 'D', text: '4', color: 'yellow' } ], correct: 'C' },
       // --- Mathematics Questions (30) ---
       { topic: "Mathematics", question: "What is 15 multiplied by 6?", image: null, name: "Multiplication", answers: [ { id: 'A', text: '80', color: 'blue' }, { id: 'B', text: '90', color: 'pink' }, { id: 'C', text: '75', color: 'green' }, { id: 'D', text: '100', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "How many sides does a pentagon have?", image: null, name: "Pentagon Sides", answers: [ { id: 'A', text: '4', color: 'blue' }, { id: 'B', text: '6', color: 'pink' }, { id: 'C', text: '5', color: 'green' }, { id: 'D', text: '7', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the value of Pi (π) rounded to two decimal places?", image: null, name: "Value of Pi", answers: [ { id: 'A', text: '3.12', color: 'blue' }, { id: 'B', text: '3.14', color: 'pink' }, { id: 'C', text: '3.16', color: 'green' }, { id: 'D', text: '3.18', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "What is the square root of 64?", image: null, name: "Square Root", answers: [ { id: 'A', text: '7', color: 'blue' }, { id: 'B', text: '6', color: 'pink' }, { id: 'C', text: '9', color: 'green' }, { id: 'D', text: '8', color: 'yellow' } ], correct: 'D' },
       { topic: "Mathematics", question: "What is 50% of 250?", image: null, name: "Percentage Calculation", answers: [ { id: 'A', text: '100', color: 'blue' }, { id: 'B', text: '125', color: 'pink' }, { id: 'C', text: '150', color: 'green' }, { id: 'D', text: '50', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "What type of angle is greater than 90 degrees but less than 180 degrees?", image: null, name: "Angle Types", answers: [ { id: 'A', text: 'Acute Angle', color: 'blue' }, { id: 'B', text: 'Right Angle', color: 'pink' }, { id: 'C', text: 'Obtuse Angle', color: 'green' }, { id: 'D', text: 'Reflex Angle', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the next prime number after 13?", image: null, name: "Prime Numbers", answers: [ { id: 'A', text: '15', color: 'blue' }, { id: 'B', text: '17', color: 'pink' }, { id: 'C', text: '16', color: 'green' }, { id: 'D', text: '19', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "If a triangle has sides of length 3, 4, and 5 units, what type of triangle is it?", image: null, name: "Triangle Classification", answers: [ { id: 'A', text: 'Equilateral', color: 'blue' }, { id: 'B', text: 'Isosceles', color: 'pink' }, { id: 'C', text: 'Right-angled', color: 'green' }, { id: 'D', text: 'Obtuse', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the result of 100 divided by 4?", image: null, name: "Division", answers: [ { id: 'A', text: '20', color: 'blue' }, { id: 'B', text: '25', color: 'pink' }, { id: 'C', text: '30', color: 'green' }, { id: 'D', text: '50', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "How many degrees are in a circle?", image: null, name: "Circle Degrees", answers: [ { id: 'A', text: '180', color: 'blue' }, { id: 'B', text: '270', color: 'pink' }, { id: 'C', text: '360', color: 'green' }, { id: 'D', text: '90', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the term for the longest side of a right-angled triangle?", image: null, name: "Right Triangle Side", answers: [ { id: 'A', text: 'Adjacent', color: 'blue' }, { id: 'B', text: 'Opposite', color: 'pink' }, { id: 'C', text: 'Hypotenuse', color: 'green' }, { id: 'D', text: 'Leg', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the value of 7 cubed (7³)?", image: null, name: "Cubed Number", answers: [ { id: 'A', text: '21', color: 'blue' }, { id: 'B', text: '49', color: 'pink' }, { id: 'C', text: '343', color: 'green' }, { id: 'D', text: '256', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What does the Roman numeral 'C' represent?", image: null, name: "Roman Numerals", answers: [ { id: 'A', text: '50', color: 'blue' }, { id: 'B', text: '100', color: 'pink' }, { id: 'C', text: '500', color: 'green' }, { id: 'D', text: '1000', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "What is the perimeter of a square with a side length of 9 units?", image: null, name: "Square Perimeter", answers: [ { id: 'A', text: '18', color: 'blue' }, { id: 'B', text: '81', color: 'pink' }, { id: 'C', text: '36', color: 'green' }, { id: 'D', text: '27', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "Which of these numbers is NOT a factor of 30?", image: null, name: "Factors", answers: [ { id: 'A', text: '5', color: 'blue' }, { id: 'B', text: '6', color: 'pink' }, { id: 'C', text: '10', color: 'green' }, { id: 'D', text: '4', color: 'yellow' } ], correct: 'D' },
       { topic: "Mathematics", question: "What is the formula for the area of a circle?", image: null, name: "Circle Area Formula", answers: [ { id: 'A', text: 'π * diameter', color: 'blue' }, { id: 'B', text: '2 * π * radius', color: 'pink' }, { id: 'C', text: 'π * radius²', color: 'green' }, { id: 'D', text: 'π * diameter²', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "Solve for x: 2x + 5 = 15", image: null, name: "Simple Algebra", answers: [ { id: 'A', text: '10', color: 'blue' }, { id: 'B', text: '5', color: 'pink' }, { id: 'C', text: '7.5', color: 'green' }, { id: 'D', text: '20', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "How many millimeters are in one centimeter?", image: null, name: "Metric Conversion", answers: [ { id: 'A', text: '100', color: 'blue' }, { id: 'B', text: '1000', color: 'pink' }, { id: 'C', text: '10', color: 'green' }, { id: 'D', text: '0.1', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the least common multiple (LCM) of 4 and 6?", image: null, name: "Least Common Multiple", answers: [ { id: 'A', text: '24', color: 'blue' }, { id: 'B', text: '8', color: 'pink' }, { id: 'C', text: '12', color: 'green' }, { id: 'D', text: '2', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the sum of the angles in any triangle?", image: null, name: "Triangle Angle Sum", answers: [ { id: 'A', text: '90 degrees', color: 'blue' }, { id: 'B', text: '360 degrees', color: 'pink' }, { id: 'C', text: '180 degrees', color: 'green' }, { id: 'D', text: '270 degrees', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is 3/4 expressed as a decimal?", image: null, name: "Fraction to Decimal", answers: [ { id: 'A', text: '0.25', color: 'blue' }, { id: 'B', text: '0.50', color: 'pink' }, { id: 'C', text: '0.75', color: 'green' }, { id: 'D', text: '0.34', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "How many faces does a cube have?", image: null, name: "Cube Faces", answers: [ { id: 'A', text: '4', color: 'blue' }, { id: 'B', text: '8', color: 'pink' }, { id: 'C', text: '6', color: 'green' }, { id: 'D', text: '12', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the result of (-5) + 12?", image: null, name: "Integer Addition", answers: [ { id: 'A', text: '-17', color: 'blue' }, { id: 'B', text: '7', color: 'pink' }, { id: 'C', text: '-7', color: 'green' }, { id: 'D', text: '17', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "Which prefix means 'thousand' in the metric system?", image: null, name: "Metric Prefix", answers: [ { id: 'A', text: 'Centi-', color: 'blue' }, { id: 'B', text: 'Milli-', color: 'pink' }, { id: 'C', text: 'Kilo-', color: 'green' }, { id: 'D', text: 'Deca-', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the area of a rectangle with length 8 and width 5?", image: null, name: "Rectangle Area", answers: [ { id: 'A', text: '13', color: 'blue' }, { id: 'B', text: '26', color: 'pink' }, { id: 'C', text: '40', color: 'green' }, { id: 'D', text: '3', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is 10 to the power of 0 (10⁰)?", image: null, name: "Zero Exponent", answers: [ { id: 'A', text: '0', color: 'blue' }, { id: 'B', text: '10', color: 'pink' }, { id: 'C', text: '1', color: 'green' }, { id: 'D', text: 'Undefined', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "What is the mode of the following set of numbers: 2, 4, 5, 4, 6, 4, 7?", image: null, name: "Mode", answers: [ { id: 'A', text: '2', color: 'blue' }, { id: 'B', text: '4', color: 'pink' }, { id: 'C', text: '5', color: 'green' }, { id: 'D', text: '6', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "How many minutes are in 2.5 hours?", image: null, name: "Time Conversion", answers: [ { id: 'A', text: '120', color: 'blue' }, { id: 'B', text: '150', color: 'pink' }, { id: 'C', text: '180', color: 'green' }, { id: 'D', text: '250', color: 'yellow' } ], correct: 'B' },
       { topic: "Mathematics", question: "What is the greatest common divisor (GCD) of 12 and 18?", image: null, name: "Greatest Common Divisor", answers: [ { id: 'A', text: '3', color: 'blue' }, { id: 'B', text: '4', color: 'pink' }, { id: 'C', text: '6', color: 'green' }, { id: 'D', text: '2', color: 'yellow' } ], correct: 'C' },
       { topic: "Mathematics", question: "If a car travels at 60 km/h, how far will it travel in 3 hours?", image: null, name: "Distance Calculation", answers: [ { id: 'A', text: '120 km', color: 'blue' }, { id: 'B', text: '150 km', color: 'pink' }, { id: 'C', text: '180 km', color: 'green' }, { id: 'D', text: '20 km', color: 'yellow' } ], correct: 'C' },
     ];

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// --- Modal Components ---
function QuizOverModal({ isOpen, timeLeft, finalScore, totalQuestions, error, onContinue }) {
  if (!isOpen) return null;
  const titleId = "quizOverModalTitle"; const descriptionId = "quizOverModalDesc";
  let title = ""; let description = "";
  if (error) { title = "⚠️ Quiz Error"; description = error; }
  else if (timeLeft <= 0) { title = "⏰ Time is up!!!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
  else { title = "🎉 Quiz Complete!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
        <h2 id={titleId} className="text-2xl font-bold mb-2">{title}</h2>
        <p id={descriptionId} className="text-xl mb-6">{description}</p>
        <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">Continue</button>
      </div>
    </div>
  );
}

function CancelModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  const titleId = "cancelModalTitle";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
        <h2 id={titleId} className="text-xl sm:text-2xl font-bold mb-6">Do you want to cancel the quiz?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={onCancel} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">No, Continue Quiz</button>
          <button onClick={onConfirm} className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto">Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ feedback, isOpen, onContinue, isLastQuestion }) {
  if (!isOpen || !feedback) return null;
  const titleId = "feedbackModalTitle"; const descriptionId = "feedbackModalDesc";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className={`p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 id={titleId} className="text-2xl font-bold mb-3">{feedback.isCorrect ? "✅ Correct!" : "❌ Incorrect"}</h2>
        {!feedback.isCorrect && (<p id={descriptionId} className="mb-4 text-gray-700">The correct answer was: <span className="font-semibold">{feedback.correctAnswerText}</span></p>)}
        {feedback.isCorrect && <p id={descriptionId}></p>}
        <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">{isLastQuestion ? "Finish Quiz" : "Next Question"}</button>
      </div>
    </div>
  );
}

// --- Helper Component for Timer Display ---
function TimerDisplay({ timeDigits }) {
  return (
    <div className="flex justify-center items-center space-x-1 lg:space-x-1.5" aria-live="off">
      <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[0]}</span>
      <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[1]}</span>
      <span className="text-2xl font-mono text-black mx-0.5 pb-1">:</span>
      <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[2]}</span>
      <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[3]}</span>
    </div>
  );
}

// --- Main Quiz Gameplay Component (Updated) ---
function DoingQuiz() {
  const { topic = 'default', time = '01:00', items = '10' } = useParams();
  const navigate = useNavigate();

  const totalItems = useMemo(() => parseInt(items, 10) || 10, [items]);
  const initialTimeInSeconds = useMemo(() => {
    const parts = time.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return Math.max(0, minutes * 60 + seconds);
      }
    }
    return 60;
  }, [time]);

  const [quizStatus, setQuizStatus] = useState('loading');
  const [quizError, setQuizError] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setcorrect] = useState(0);
  const [wrongQ, setwrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const [finalScore, setFinalScore] = useState(0);
  const [finalUnanswered, setFinalUnanswered] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setQuizStatus('loading');
    setQuizError(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setwrong(0);
    setcorrect(0);
    setTimeLeft(initialTimeInSeconds);
    setFinalScore(0);
    setFinalUnanswered(0);
    setIsAnswerSelected(false);
    setAnswerFeedback(null);
    setShowCancelModal(false);

    const filteredQuestions = questionBank.filter(q => q.topic.toLowerCase() === topic?.toLowerCase());
    if (filteredQuestions.length === 0) {
      setQuizError(`No questions found for the topic "${topic}".`);
      setQuizStatus('error');
      return;
    }
    const selectedQuestions = shuffleArray([...filteredQuestions]).slice(0, totalItems);
    if (selectedQuestions.length === 0 && totalItems > 0) {
      setQuizError(`Could not select any questions for topic "${topic}".`);
      setQuizStatus('error');
      return;
    }
    setQuizQuestions(selectedQuestions);
    setQuizStatus('running');
  }, [topic, totalItems, initialTimeInSeconds]);

  useEffect(() => {
    if (quizStatus !== 'running' || timeLeft <= 0) {
      if (timeLeft <= 0 && quizStatus === 'running') {
        setFinalScore(score);
        const unansweredCount = quizQuestions.length - currentQuestionIndex;
        setFinalUnanswered(unansweredCount);
        setQuizStatus('finished');
      }
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, quizStatus, score, quizQuestions, currentQuestionIndex]);

  const currentQuestion = useMemo(() => {
    if (quizStatus !== 'running' || quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
      return null;
    }
    return quizQuestions[currentQuestionIndex];
  }, [quizStatus, quizQuestions, currentQuestionIndex]);

  const timeDigits = useMemo(() => {
    const minutes = Math.max(0, Math.floor(timeLeft / 60));
    const seconds = Math.max(0, timeLeft % 60);
    return [
      String(minutes).padStart(2, '0')[0], String(minutes).padStart(2, '0')[1],
      String(seconds).padStart(2, '0')[0], String(seconds).padStart(2, '0')[1],
    ];
  }, [timeLeft]);

  const isQuizOver = useMemo(() => quizStatus === 'finished' || quizStatus === 'error', [quizStatus]);

  const handleAnswerClick = useCallback((selectedAnswerId) => {
    if (!currentQuestion || isAnswerSelected || quizStatus !== 'running') return;
    const isCorrect = selectedAnswerId === currentQuestion.correct;
    if (isCorrect) {
        setcorrect(prevCorrect => prevCorrect+1);
      setScore(prevScore => prevScore + 1);
    } else {
      setwrong(prevWrong => prevWrong + 1);
      if (score > 0) {
        setScore(prevScore => prevScore - 1);
      }
    }
    setAnswerFeedback({
      isCorrect,
      correctAnswerText: currentQuestion.answers.find(a => a.id === currentQuestion.correct)?.text || 'N/A',
      selectedAnswerId: selectedAnswerId
    });
    setIsAnswerSelected(true);
  }, [currentQuestion, isAnswerSelected, quizStatus, score]);

  const handleContinueAfterFeedback = useCallback(() => {
    setIsAnswerSelected(false);
    setAnswerFeedback(null);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setFinalScore(score);
      setFinalUnanswered(0);
      setQuizStatus('finished');
    }
  }, [currentQuestionIndex, quizQuestions.length, score]);

  const handleBackClick = useCallback(() => setShowCancelModal(true), []);
  const handleCancelConfirm = useCallback(() => navigate("/"), [navigate]);
  const handleCancelDismiss = useCallback(() => setShowCancelModal(false), []);

  const handleQuizEndContinue = useCallback(() => {
    const totalQs = quizQuestions.length > 0 ? quizQuestions.length : totalItems;
    navigate("summary", {
      state: {
        score: finalScore,
        correct1: correct,
        wrong: wrongQ,
        total: totalQs,
        unanswered: finalUnanswered
      }
    });
  }, [navigate, finalScore, wrongQ, quizQuestions, totalItems, finalUnanswered]);

  const handleImageError = useCallback((event) => {
    console.warn("Image failed to load:", event.target.src);
    event.target.style.display = 'none';
  }, []);

  const getButtonProps = useCallback((answer) => {
    const baseClasses = `w-full text-left font-bold py-3 px-5 rounded-lg shadow mb-3 md:w-auto md:mb-0 transition-all duration-150 ease-in-out`;
    const colorClasses = {
      'yellow': 'bg-yellow-500 hover:bg-yellow-600 text-black',
      'blue': 'bg-blue-500 hover:bg-blue-600 text-white',
      'pink': 'bg-pink-500 hover:bg-pink-600 text-white',
      'green': 'bg-green-500 hover:bg-green-600 text-white',
      'default': 'bg-gray-500 hover:bg-gray-600 text-white'
    };
    let style = `${baseClasses} ${colorClasses[answer.color] || colorClasses['default']}`;
    let isDisabled = false;
    if (answerFeedback && isAnswerSelected) {
      isDisabled = true;
      if (answer.id === currentQuestion?.correct) {
        style += ' ring-4 ring-offset-2 ring-green-400 scale-105';
      } else if (answer.id === answerFeedback.selectedAnswerId) {
        style += ' ring-4 ring-offset-2 ring-red-400 opacity-70';
      } else {
        style += ' opacity-50';
      }
    } else if (isAnswerSelected && !answerFeedback) {
      isDisabled = true;
      style += ' opacity-50 cursor-not-allowed';
    }
    return { className: style, disabled: isDisabled };
  }, [answerFeedback, isAnswerSelected, currentQuestion]);

  if (quizStatus === 'loading') {
    return (
      <div className="bg-gray-300 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading Quiz...</p>
      </div>
    );
  }

  if (isQuizOver) {
    return (
      <QuizOverModal
        isOpen={true}
        timeLeft={timeLeft}
        finalScore={finalScore}
        totalQuestions={quizQuestions.length > 0 ? quizQuestions.length : totalItems}
        error={quizError}
        onContinue={handleQuizEndContinue}
      />
    );
  }

    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center p-4 font-sans bg-bgimg">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-3xl md:p-6 lg:p-8 relative">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded shadow">Back</button>
                    <div className="text-center" aria-live="polite">
                        <div className="bg-orange-500 text-white px-4 py-1 rounded-full shadow-md inline-block">
                            <span className="block text-xs font-medium leading-tight tracking-wider">SCORE</span>
                            <span className="block text-xl font-bold leading-tight">{score}</span>
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 w-16 text-right tabular-nums">
                        {currentQuestionIndex + 1}/{quizQuestions.length}
                    </div>
                </div>

                {/* Desktop Header */}
                <header className="hidden md:flex justify-between items-center mb-8 relative">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-1.5 rounded shadow">Back</button>
                    <div className="text-center flex-grow mx-4">
                        <div className="text-sm font-semibold text-gray-600 mb-1 tabular-nums" aria-hidden="true">
                            Question {currentQuestionIndex + 1} of {quizQuestions.length}
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 uppercase tracking-wider">Time</h1>
                        <div className="mt-2">
                            <TimerDisplay timeDigits={timeDigits} />
                        </div>
                    </div>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded shadow text-center" aria-live="polite">
                        <span className="block text-xs font-medium uppercase tracking-wider">Score</span>
                        <span className="block text-xl font-bold">{score}</span>
                    </div>
                </header>

                {/* Question Area */}
                <main className="text-center mb-6 md:mb-8">
                    <p className="text-gray-800 mb-4 text-lg lg:text-xl font-medium px-2 leading-relaxed">
                        <span className="sr-only">Question {currentQuestionIndex + 1} of {quizQuestions.length}:</span>
                        {currentQuestion?.question}
                    </p>
                    {currentQuestion?.image && (
                        <div className="bg-white inline-block p-4 rounded-lg shadow-md w-4/5 max-w-[250px] md:max-w-xs md:rounded-lg md:border md:border-gray-300 md:p-6 my-4">
                            <img
                                src={currentQuestion.image}
                                alt={currentQuestion.name || `Quiz visual aid`}
                                className="h-32 md:h-40 w-auto mx-auto object-contain"
                                onError={handleImageError}
                            />
                        </div>
                    )}
                </main>

                {/* Mobile Timer Display */}
                <div className="flex justify-center items-center mb-8 md:hidden">
                    <TimerDisplay timeDigits={timeDigits} />
                </div>

                {/* Answer Buttons */}
                <section className="w-full max-w-sm mx-auto px-4 md:px-0 md:max-w-none md:bg-gradient-to-b from-gray-800 to-black md:p-6 md:rounded-lg md:shadow-inner">
                    <h2 className="sr-only">Choose an answer:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:gap-4">
                        {currentQuestion?.answers.map((answer) => {
                            const buttonProps = getButtonProps(answer);
                            return (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerClick(answer.id)}
                                    disabled={buttonProps.disabled}
                                    className={buttonProps.className}
                                    aria-label={`Answer ${answer.id}: ${answer.text}`}
                                >
                                    <span className="font-bold mr-2">{answer.id}.</span> {answer.text}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Modals */}
            <CancelModal
                isOpen={showCancelModal}
                onConfirm={handleCancelConfirm}
                onCancel={handleCancelDismiss}
            />
            <FeedbackModal
                isOpen={Boolean(answerFeedback)}
                feedback={answerFeedback}
                onContinue={handleContinueAfterFeedback}
                isLastQuestion={currentQuestionIndex >= quizQuestions.length - 1}
            />
        </div>
    );
}

export default DoingQuiz;
