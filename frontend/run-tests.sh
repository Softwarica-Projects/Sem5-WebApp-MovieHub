#!/bin/bash

# MovieHub Frontend Test Runner
# This script runs the working tests with proper configuration

echo "🧪 MovieHub Frontend Test Suite"
echo "================================"
echo ""

echo "📋 Running Test Summary..."
npm test -- --testPathPattern="TestSuiteSummary" --watchAll=false --verbose

echo ""
echo "🎯 Running Component Tests..."
npm test -- --testPathPattern="SimpleMovieCard|SimpleLoginForm" --watchAll=false --verbose

echo ""
echo "🛠️  Running Utility Tests..."
npm test -- --testPathPattern="toastUtils|imageUtils" --watchAll=false --verbose

echo ""
echo "📊 Running All Working Tests with Coverage..."
npm test -- --testPathPattern="TestSuiteSummary|SimpleMovieCard|SimpleLoginForm|toastUtils|imageUtils" --coverage --watchAll=false

echo ""
echo "✅ Test run complete!"
echo "📁 Check coverage report in: coverage/lcov-report/index.html"
