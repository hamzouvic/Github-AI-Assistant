import express from 'express';
import {getSession, chatReq, writeFile, saveSession} from "./chatgpt.js";
import fs from "fs";
import {
    createIssue,
    createProject,
    createProjectFromCopy,
    gettingProjectInformation,
    getRepositoryInfo,
    getUserInfo, addIssueToProject, updateIssueStatus, linkProjectToRepository, uploadProject
} from "./github.js";

const app = express();
const port = 3000;

import bodyParser from 'body-parser';
import cors from "cors";

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
    const response = await chatReq();
    res.send(response);
});

app.get('/session', (req, res) => {
    res.json(getSession());
});

app.post('/prompt', async (req, res) => {
    const prompt = req.body.prompt;
    if(prompt === "" || prompt === undefined){
        return res.status(404)
    }else if (prompt.trim() === "UPLOAD") {
        const session = getSession()

        await uploadProject(session)
    } else {
        const session = getSession()
        const data = {
            role: 'user',
            content: prompt
        };
        session.push(data);
        const response = await chatReq(session);
        saveSession(session)
        res.json(response);
    }
});

app.get('/github', async (req, res) => {
    const repo = await createProject('HAMZAv2', 'from app', 'R_kgDOLewzyg', 'U_kgDOCGQidw');
    console.log('repo ', repo);
    res.json(repo);
});

const projectClone = `{
  "user": {
    "projectV2": {
      "id": "PVT_kwHOCGQid84Ae4vl",
      "fields": {
        "nodes": [
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy2k",
            "dataType": "TITLE",
            "name": "Title"
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy2o",
            "dataType": "ASSIGNEES",
            "name": "Assignees"
          },
          {
            "id": "PVTSSF_lAHOCGQid84Ae4vlzgUYy2s",
            "dataType": "SINGLE_SELECT",
            "name": "Status",
            "options": [
              {
                "id": "d8ef29e2",
                "name": "📫 Triage"
              },
              {
                "id": "efab0684",
                "name": "🗄 Backlog"
              },
              {
                "id": "f75ad846",
                "name": "🛠 Todo"
              },
              {
                "id": "47fc9ee4",
                "name": "⚙ In Progress"
              },
              {
                "id": "1c48584c",
                "name": "👀 In Review"
              },
              {
                "id": "076ef7cf",
                "name": "⏳ Blocked"
              },
              {
                "id": "98236657",
                "name": "✅ Done"
              }
            ]
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy2w",
            "dataType": "LABELS",
            "name": "Labels"
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy20",
            "dataType": "LINKED_PULL_REQUESTS",
            "name": "Linked pull requests"
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy24",
            "dataType": "MILESTONE",
            "name": "Milestone"
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy28",
            "dataType": "REPOSITORY",
            "name": "Repository"
          },
          {
            "id": "PVTF_lAHOCGQid84Ae4vlzgUYy3I",
            "dataType": "REVIEWERS",
            "name": "Reviewers"
          },
          {
            "id": "PVTSSF_lAHOCGQid84Ae4vlzgUYy3M",
            "dataType": "SINGLE_SELECT",
            "name": "Priority",
            "options": [
              {
                "id": "f04af505",
                "name": "🔥 Urgent"
              },
              {
                "id": "b3447012",
                "name": "🔴 High"
              },
              {
                "id": "693cf670",
                "name": "🟡 Medium"
              },
              {
                "id": "49b761e6",
                "name": "🟢 Low"
              }
            ]
          },
          {
            "id": "PVTSSF_lAHOCGQid84Ae4vlzgUYy3Q",
            "dataType": "SINGLE_SELECT",
            "name": "Estimated Time",
            "options": [
              {
                "id": "746d1193",
                "name": "⛰ Epic (\u003E 3d)"
              },
              {
                "id": "b4e2b714",
                "name": "🗼 Large (2-3d)"
              },
              {
                "id": "d99f2a15",
                "name": "🏛 Medium (~1d)"
              },
              {
                "id": "2a81616e",
                "name": "🏠 Small (1-4h)"
              },
              {
                "id": "158a597a",
                "name": "🛖 Tiny (\u003C 1h)"
              }
            ]
          }
        ]
      }
    }
  }
}`

const issueClone = `{
  "createIssue": {
    "issue": {
      "url": "https://github.com/hamzouvic/testing-app/issues/12",
      "id": "I_kwDOLewzys6DPmmD"
    }
  }
}`

const projectIssueClone = `{"addProjectV2ItemById":{"item":{"id":"PVTI_lAHOCGQid84Ae4vlzgNqku0"}}}`
app.get('/test', async (req, res) => {
// //     get user Id
//     const projectIdClone = "PVT_kwDOBYVjWc4AJhcX"
//     const userInfo = await getUserInfo("hamzouvic")
//     const userId = userInfo.user.id
// //     create project from template
//     const project = await createProjectFromCopy(userId,projectIdClone)
// //     getProjectInformation
//     const projectInfo = await gettingProjectInformation(project.copyProjectV2.projectV2.number)
    const projectInfo = JSON.parse(projectClone)

    const repositoyInfo = await getRepositoryInfo("hamzouvic", "testing-app")
    return res.json(repositoyInfo)
    await linkProjectToRepository(projectInfo.user.projectV2.id, repositoyInfo.repository.id)

    const status = projectInfo.user.projectV2.fields.nodes[2]
    // create an issue :
    // const issue = await createIssue('issue #2',"this is a description from the app",repositoyInfo.repository.id)
    const issue = JSON.parse(issueClone)

//     add issue to project
//     const projectIssue = await addIssueToProject(issue.createIssue.issue.id,projectInfo.user.projectV2.id)
    const projectIssue = JSON.parse(projectIssueClone)
//     change Status of issue :
    const updatedIssue = await updateIssueStatus(projectIssue.addProjectV2ItemById.item.id, projectInfo.user.projectV2.id,
        status.id, status.options[2].id)
    res.json(updatedIssue)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

