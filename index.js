(function () {
  'use strict';

  function visibleProjects(config) {
    const list = config && Array.isArray(config.projects) ? config.projects : [];
    return list.filter((p) => p && p.name && p.url && !p.hide);
  }

  function render(projects) {
    const ul = document.getElementById('projects');
    const status = document.getElementById('status');
    ul.textContent = '';
    projects.forEach((p) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'card';
      a.href = p.url;
      const h = document.createElement('h2');
      h.textContent = p.name;
      const d = document.createElement('p');
      d.textContent = p.description || '';
      a.append(h, d);
      li.appendChild(a);
      ul.appendChild(li);
    });
    status.textContent = projects.length ? '' : 'No projects to show.';
  }

  if (typeof module !== 'undefined') module.exports = { visibleProjects };
  if (typeof document === 'undefined') return;

  fetch('projects.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((c) => render(visibleProjects(c)))
    .catch(() => { document.getElementById('status').textContent = 'Could not load projects.'; });
})();
