#
# Backend
#
cd backend
echo "npm install on backend"
npm install
cd ..

#
# Frontend
#
cd frontend
echo "yarn install on frontend"
yarn install
cd ..

#
# CDK
#
echo "npm install on cdk"
cd cdk
npm install
cd ..