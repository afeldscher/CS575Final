# SE 575 Final
Live Demo available at: https://575blockchain.azurewebsites.net/

## Authors
Adam Feldscher aff39

Safa Aman sra68
  
## Overview
Our project is a Restaurant Bill and Tip Simulator, built using a block chain. The idea being that a waiter/waitress will give a customer their check as a block. This is added to the chain using a proof of work hashing scheme. If they are a large party, the waiter may a tip upfront into the initial bill. Otherwise, the customer must add another block to the chain with their tip amount. 

If a customer tries to be crafty and modify their bill, they will invalidate the chain, indicated by the block turning red on screen. Similarly, if a waiter/waitress tries to change their tip they will also invalidate the chain. 

Since this is just a simulator, all state is maintained in the front end. It makes calls to the server to calculate hashes and solve blocks.

## Demo video
TODO


## Tech Stack 
### Backend: 
* Kotlin on Java 8. 
* Ktor Framework 
* Netty Webserver

### Front-end: 
* ReactJS
* jQuery
* Materialize-css

## Architecture


## CI/CD Pipeline 

Our automated build and deploy pipeline is setup using GitHub Actions and deployed into an Azure App Service running in free tier.

### Build

Within our project, the backend, at the root of the repo, is built using gradle and the front-end, under `./frontend` is built using npm

The automated Github action profile is defined using a yaml configuration file, located at `.github/workflows/gradle.yml` This defines the required build and deploy steps which are run in a new container on every push. The steps are outlined below:

1. Run `npm install` to pull the React front-end dependencies 
1. Run `npm build` to build the React front-end
1. Copy the built front-end into the server resources directory
1. Run `gradle build` to build the server
1. Run `gradle test` to test the server code
1. Deploy to Azure

If any of these steps are failing, the pipeline will stop and this badge will indicate a failed build:

[![Actions Status](https://github.com/afeldscher/CS575Final/workflows/JavaCI/badge.svg)](https://github.com/afeldscher/CS575Final/actions)

Clicking the badge reveals more information about what step failed and the build logs. 

### Deploy

Once all of the build steps have been completed, the deploy step will begin. As part of the `gradle build`, a fat jar is built of the application. This contains all of the serer binaries and static content needed to run the application. This means that we simply need to deploy this jar and execute it on our server. 

On Azure we setup a Hosted Web App Container using free shared resources (with our student Dreamspark subscription). On creation we configured it to use Java 1.8. Github Actions has a built in plugin for Azure deployments. All we had to do was specify what files should be deployed (our jar) and our Azure Deployment Keys, via a secure variable. 

This plugin automatically pushes the jar file out to the container and restarts it. If the deployment fails, the build badge above will indicate a failure. 

Our Azure app is deployed at: https://575blockchain.azurewebsites.net/

## Remarks
Overall this was a very exciting project. We got to explore several new technologies that we otherwise may have never come across:
* Kotlin - Despite our past experience with Java and Spring Framework, neither of us had ever used Kotlin. We decided to jump in head first and found it to be easy to learn and fun to use. 
* ReactJS - Having never used a framework like react before we initially had some issues getting it setup and working with the Kotlin server. After reading some tutorials we got everything working and found it made developing the front-end much easier. 
* Github Actions - In the past we have used build systems such as Team City, which gave us a little more context here. Unlike many web based build servers, Github Actions uses entirely yaml based configuration. Not having a gui to fall back on took some getting used to, but overall it worked reliably and got the job done. 
* Azure - We had some experience playing with Azure's app services before, but had never deployed a Java app. Most of the Microsoft tooling is geared towards .NET projects, so it required a little more configuration than we had done in the past. Azure's intuitive interface and great tutorials made this relatively straight forward once we got the application packaged into a single jar. 


## References
* https://ktor.io/quickstart/
* https://en.bitcoin.it/wiki/Block_hashing_algorithm
* https://www.javacodemonk.com/md5-and-sha-256-in-java-kotlin-and-android-96ed9628s
* https://help.github.com/en/actions/automating-your-workflow-with-github-actions
* https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-java
* https://github.com/mbannikov/ktor-react-example
* https://www.investopedia.com/terms/d/doublespending.asp
