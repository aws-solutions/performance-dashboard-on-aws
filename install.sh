npm i

#
# Backend
#
cd backend
echo "npm install on backend"
npm i $@
cd ..

#
# Frontend
#
cd frontend
echo "npm install on frontend"
npm i $@
cd ..

#
# E2ETests
#
echo "npm install on e2e-tests"
cd e2e-tests
npm i $@
cd ..

#
# Examples
#
echo "npm install on examples"
cd examples
npm i $@
cd ..

#
# CDK
#
echo "npm install on cdk"
cd cdk
npm i
cd ..