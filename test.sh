#
# Backend
#
cd backend
echo "Running backend unit tests"
npm run test
cd ..

#
# Frontend
#
cd frontend
echo "Running frontend unit tests"
CI=true yarn test
cd ..

#
# CDK
#
echo "Running cdk unit tests"
cd cdk
npm run test
cd ..