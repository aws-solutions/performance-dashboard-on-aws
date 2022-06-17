#
# Backend
#
cd backend
echo "npm install on backend"
npm ci
cd ..

#
# Frontend
#
cd frontend
echo "npm install on frontend"
npm ci
cd ..

#
# CDK
#
echo "npm install on cdk"
cd cdk
npm ci
cd ..

#
# Examples
#
echo "npm install on examples"
cd examples
npm ci
cd ..