# Runs unit tests for all 2 packages. 

#
# Backend
#
cd backend
echo "Running backend unit tests"
npm run test:ci  # Avoid interactive mode on tests
if [ $? -eq 1 ]
then
  echo "Backend tests failed"
  exit 1
fi
cd ..

#
# Frontend
#
cd frontend
echo "Running frontend unit tests"
CI=true npm run test # Avoid interactive mode on tests
if [ $? -eq 1 ]
then
  echo "Frontend tests failed"
  exit 1
fi
cd ..