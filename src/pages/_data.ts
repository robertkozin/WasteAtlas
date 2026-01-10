import { getCollection, getEntries } from "astro:content"

const isProd = import.meta.env.PROD

let wasteCol = await getCollection("wastes", waste => { 
    // coger los residuos de la database y poniendolo en una viariable
  if (isProd) {
    const isReady = ["ready", "published"].includes(waste.data.status)
    return isReady
  } else {
    return true
  }
})
let wastes = wasteCol.map(w => w.data)

let projectCol = await getCollection("projects", project => { 
    // coger los proyectos de la database y poniendolo en una variable
  if (isProd) {
    const isReady = ["ready", "published"].includes(project.data.status)
    return isReady
  } else {
    return true
  }
})
let projects = projectCol.map(p => p.data)

let allWastesP = wastes.map (async waste=> {
    let projects = await getEntries (waste.project_refs)
    return projects.map (project => {
        return {
            ...waste, 
            project: project.data
        }
    })
})

export let allWastes = (await Promise.all (allWastesP)).flat()