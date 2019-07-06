const tabItems = document.querySelector('.tab-items');
const tabItemsChildren = [...tabItems.children];

tabItemsChildren.forEach(el => el.addEventListener('click', (e) => {
  const tabViews = document.querySelector('.tab-views');
  const index = tabItemsChildren.indexOf(e.target);

  const activeView = tabViews.querySelector('.active');
  if (activeView) activeView.classList.remove('active');

  const activeTab = tabItems.querySelector('.active');
  if (activeTab) activeTab.classList.remove('active');

  [...tabViews.children][index].classList.add('active');
  tabItemsChildren[index].classList.add('active');
}));