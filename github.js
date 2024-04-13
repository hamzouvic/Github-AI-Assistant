import {graphql} from "@octokit/graphql";
import {config} from "dotenv";

config();
const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
    },
});

export async function getUserInfo(username) {
    const mutationQuery = `
query {
  user(login:"${username}") {
    id
  }
}`;
    try {
        const userInfo = await graphqlWithAuth(mutationQuery);
        return userInfo;
    } catch (error) {
        console.error("Error fetching repository:", error);
        throw error;
    }
}

export async function createProject(name, body, repositoryIds, ownerId, template = 'BASIC_KANBAN') {

    const mutationQuery = `
mutation {
  createProjectV2(input: {
    title: "${name}",
    repositoryId: "${repositoryIds}",
    ownerId: "${ownerId}",
    template: BASIC_KANBAN
  }) {
    clientMutationId
  }
}`;
    try {
        const project = await graphqlWithAuth(mutationQuery);
        return project;
    } catch (error) {
        console.error("Error fetching repository:", error);
        throw error;
    }
}

export async function linkProjectToRepository(projectId, repositoryId) {

    const mutationQuery = `
mutation {
    linkProjectV2ToRepository(input:{
        projectId : "${projectId}"
        repositoryId : "${repositoryId}"
    }){
        __typename
    }
}`;
    try {
        const response = await graphqlWithAuth(mutationQuery);
        return response;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
}

export async function createIssue(title, description, repositoryId) {

    const mutationQuery = `
mutation {
    createIssue (input:{
        title:"${title}"
        body: "${description}"
        repositoryId: "${repositoryId}"
    }){
        issue{
            url
            id
        }
    }
}`;
    try {
        const issue = await graphqlWithAuth(mutationQuery);
        return issue;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
}

export async function addIssueToProject(issueId, projectId) {

    const mutationQuery = `
mutation {
    addProjectV2ItemById(input:{
        contentId: "${issueId}"
        projectId: "${projectId}"
    }){
        item{
            id
        }
    }
}`;
    try {
        const issueId = await graphqlWithAuth(mutationQuery);
        return issueId;
    } catch (error) {
        console.error("Error adding issue:", error);
        throw error;
    }
}

export async function updateIssueStatus(issueId, projectId, StatusFieldId, newStatusValueId) {

    const mutationQuery = `
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "${projectId}", # Replace with your ProjectV2 ID
    itemId: "${issueId}",            # The ID of the item you're updating
    fieldId: "${StatusFieldId}",          # The ID of the status field
    value: {
        singleSelectOptionId : "${newStatusValueId}"
    }            # The new status value (e.g., "In Progress")
  }) {
    projectV2Item {
      id
    }
  }
}`;
    try {
        const issueId = await graphqlWithAuth(mutationQuery);
        return issueId;
    } catch (error) {
        console.error("Error adding issue:", error);
        throw error;
    }
}

export async function getRepositoryInfo(owner, name) {

    const mutationQuery = `
query  {
    repository(owner:"${owner}",name:"${name}"){
        id
    }
}
`;
    try {
        return await graphqlWithAuth(mutationQuery);
    } catch (error) {
        console.error("Error adding issue:", error);
        throw error;
    }

}

export async function gettingProjectInformation(projectNumber) {

    const mutationQuery = `
query  {
    user(login:"hamzouvic"){
        projectV2(number:${projectNumber}){
            id
                  fields(first: 100) {
        nodes {
          ... on ProjectV2FieldCommon {
            id
            dataType
            name
          }
          ... on ProjectV2SingleSelectField {
            options {
              id
              name
            }
          }
          ... on ProjectV2IterationField {
            configuration {
              iterations {
                title
                duration
                startDate
              }
              completedIterations {
                title
                duration
                startDate
              }
              duration
              startDay
            }
          }
        }
      }

        }
    }
}
`;
    try {
        return await graphqlWithAuth(mutationQuery);
    } catch (error) {
        console.error("Error adding issue:", error);
        throw error;
    }
}

export async function createProjectFromCopy(userId, projectId) {

    const mutationQuery = `
mutation  {
  copyProjectV2(input: {
    ownerId: "${userId}"
    projectId: "${projectId}"
    title : "this is a clone project 4"
  }) {
    projectV2{
        id 
        url
        number
    }
  }
}
`;
    try {
        const projectInformation = await graphqlWithAuth(mutationQuery);
        return projectInformation;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}


export async function uploadProject(session) {
//     verify if there is a project on the repo
//     create a project from the clone
//     get the issues from chatgpt
//     format the issues
//     create the issues and add them to the project


}
