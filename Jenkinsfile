pipeline {
	agent {
		label 'pb-webapp-slave'
	}
		
	stages {
		stage('PULLING THE CHANGES') {
			steps {
				sh '''
				sudo su - pb-frontend-slave
				cd /home/pb-frontend-slave/pb-admin-backend
				sudo git pull https://github.com/Kesholabs/pesabase-react.git
				'''
			}
		}
		stage('INSTALLING DEPENDENCIES') {
			steps {
				sh '''
				sudo su - pb-frontend-slave
				cd /home/pb-frontend-slave/pb-admin-backend
				sudo npm i --silent
				'''
			}
		}
		stage('BUILDING THE CODE') {
			steps {
				sh '''
				sudo su - pb-frontend-slave
				cd /home/pb-frontend-slave/pb-admin-backend
				sudo npm run build
                                echo "successfull"
				'''
			}
		}
		}
}

