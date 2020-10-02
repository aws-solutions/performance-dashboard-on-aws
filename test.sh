# Runs unit tests for all 3 packages. 

#
# Backend
#
cd backend
echo "Running backend unit tests"
npm run test:ci # Avoid interactive mode on tests
cd ..

#
# Frontend
#
cd frontend
echo "Running frontend unit tests"
CI=true yarn test # Avoid interactive mode on tests
cd ..

#
# CDK
#
echo "Running cdk unit tests"
cd cdk
npm run test
cd ..