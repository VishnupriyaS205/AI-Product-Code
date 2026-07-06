export function getCategories(places) {
  const categories = places.map((place) => place.category)
  return ['All', ...new Set(categories)]
}
export function getCategoryCounts(planItems) {
  return planItems.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1
    return counts
  }, {})
}
export function filterPlaces(places, searchText, selectedCategory) {
  const searchValue = searchText.trim().toLowerCase()

  return places.filter((place) => {
    const matchesCategory =
      selectedCategory === 'All' || place.category === selectedCategory
    const searchableText = `${place.name} ${place.area} ${place.description}`
    const matchesSearch = searchableText.toLowerCase().includes(searchValue)

    return matchesCategory && matchesSearch
  })
}

export function buildPlanItems(places, plan) {
  return Object.entries(plan)
    .map(([placeId, planData]) => {
      const place = places.find((item) => item.id === placeId)

      if (!place) {
        return null
      }

      return {
        ...place,
        note: planData.note,
      }
    })
    .filter(Boolean)
}

export function getPlanSummary(planItems) {
  const totalItems = planItems.length
  const totalCost = planItems.reduce((total, item) => total + item.cost, 0)
  const totalDuration = planItems.reduce((total, item) => total + item.duration, 0)
  const averageCost = totalItems > 0 ? Math.round(totalCost / totalItems) : 0
  const notesCount = planItems.filter((item) => item.note.trim()).length
  return {
    totalItems,
    totalCost,
    totalDuration,
    averageCost,
    notesCount,
  }
}
export function sortPlaces(places, sortBy) {
  const placesCopy = [...places]

  if (sortBy === 'cost') {
    return placesCopy.sort((a, b) => a.cost - b.cost)
  }
  if (sortBy === 'highest-cost') {
    return placesCopy.sort((a, b) => b.cost - a.cost)
  }
  if (sortBy === 'longest-duration') {
  return placesCopy.sort((a, b) => b.duration - a.duration)
  }
  if (sortBy === 'duration') {
    return placesCopy.sort((a, b) => a.duration - b.duration)
  }

  return placesCopy
  
}