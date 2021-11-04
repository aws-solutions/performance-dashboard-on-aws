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
echo "npm install on frontend"
npm install
cd ..

#
# CDK
#
echo "npm install on cdk"
cd cdk
npm install
cd ..

#
# Examples
#
echo "npm install on examples"
cd examples
npm install
cd ../..