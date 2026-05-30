// Memory Templates - テンプレート機能
(function() {
    'use strict';

    var templates = [
        {
            id: 'gratitude',
            name: '感謝の記録',
            icon: '🙏',
            category: '日常',
            title: '今日の感謝',
            content: '今日感謝していること：\n\n1. \n2. \n3. \n\nなぜ感謝しているか：\n',
        },
        {
            id: 'travel',
            name: '旅行の思い出',
            icon: '✈️',
            category: '旅行',
            title: '',
            content: '場所：\n日付：\n\n印象に残った風景：\n\n食べたもの：\n\n出会った人：\n\nまた行きたい場所：\n',
        },
        {
            id: 'child-growth',
            name: '子供の成長',
            icon: '👶',
            category: '家族',
            title: '',
            content: '年齢：\n\n今日できるようになったこと：\n\n言った言葉：\n\n成長を感じた瞬間：\n',
        },
        {
            id: 'achievement',
            name: '達成・成功',
            icon: '🏆',
            category: '仕事',
            title: '',
            content: '達成したこと：\n\n頑張ったポイント：\n\n学んだこと：\n\n次の目標：\n',
        },
        {
            id: 'meal',
            name: '食事の記録',
            icon: '🍽️',
            category: '日常',
            title: '',
            content: 'お店／場所：\n\nメニュー：\n\n味の感想：\n\n一緒に食べた人：\n\nまた行きたい度：★★★☆☆\n',
        },
        {
            id: 'hobby',
            name: '趣味の記録',
            icon: '🎨',
            category: '趣味',
            title: '',
            content: '活動内容：\n\n今日の進捗：\n\n気づいたこと：\n\n次回やりたいこと：\n',
        },
        {
            id: 'friends',
            name: '友人との思い出',
            icon: '👫',
            category: '友人',
            title: '',
            content: '一緒にいた人：\n\n場所：\n\n何をしたか：\n\n楽しかったこと：\n\n心に残った会話：\n',
        },
        {
            id: 'season',
            name: '季節の記録',
            icon: '🌸',
            category: '季節',
            title: '',
            content: '季節：\n\n見つけた季節の変化：\n\n感じたこと：\n\nこの季節にやりたいこと：\n',
        },
        {
            id: 'free',
            name: '自由記入',
            icon: '📝',
            category: '',
            title: '',
            content: '',
        }
    ];

    function applyTemplate(templateId) {
        var tmpl = templates.find(function(t) { return t.id === templateId; });
        if (!tmpl) return;

        var titleEl = document.getElementById('title');
        var contentEl = document.getElementById('content');
        var categoryEl = document.getElementById('category');

        if (!titleEl || !contentEl) return;

        // Check if existing input exists
        var hasExisting = (titleEl.value.trim() !== '' || contentEl.value.trim() !== '');
        if (hasExisting) {
            if (!confirm('入力中の内容があります。テンプレートで上書きしますか？')) {
                return;
            }
        }

        titleEl.value = tmpl.title;
        contentEl.value = tmpl.content;

        if (categoryEl && tmpl.category) {
            // Add category option if it doesn't exist
            var optionExists = Array.from(categoryEl.options).some(function(opt) {
                return opt.value === tmpl.category;
            });
            if (!optionExists) {
                var newOpt = document.createElement('option');
                newOpt.value = tmpl.category;
                newOpt.textContent = tmpl.category;
                newOpt.className = 'bg-gray-800';
                categoryEl.appendChild(newOpt);
            }
            categoryEl.value = tmpl.category;
        } else if (categoryEl && !tmpl.category) {
            categoryEl.value = '';
        }

        // Focus on appropriate field
        if (!tmpl.title) {
            titleEl.focus();
        } else {
            contentEl.focus();
        }

        // Highlight the selected template button
        document.querySelectorAll('.template-btn').forEach(function(btn) {
            btn.classList.remove('ring-2', 'ring-purple-400');
        });
        var activeBtn = document.querySelector('[data-template="' + templateId + '"]');
        if (activeBtn) {
            activeBtn.classList.add('ring-2', 'ring-purple-400');
        }
    }

    function renderTemplateBar() {
        var uploadSection = document.getElementById('uploadSection');
        if (!uploadSection) return;

        // Find the form container (the space-y-6 div)
        var formContainer = uploadSection.querySelector('.space-y-6');
        if (!formContainer) return;

        // Check if already rendered
        if (document.getElementById('templateBar')) return;

        var bar = document.createElement('div');
        bar.id = 'templateBar';
        bar.className = 'mb-4';
        bar.innerHTML =
            '<p class="text-sm text-gray-400 mb-2">テンプレートから始める：</p>' +
            '<div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: thin; -webkit-overflow-scrolling: touch;">' +
            templates.map(function(t) {
                return '<button type="button" data-template="' + t.id + '" class="template-btn flex-shrink-0 px-3 py-2 bg-purple-900/30 border border-purple-400/20 rounded-lg text-sm hover:bg-purple-800/40 hover:border-purple-400/40 transition-all duration-200 whitespace-nowrap">' +
                    '<span class="mr-1">' + t.icon + '</span>' + t.name +
                    '</button>';
            }).join('') +
            '</div>';

        formContainer.insertBefore(bar, formContainer.firstChild);

        // Attach click handlers
        bar.querySelectorAll('.template-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                applyTemplate(this.getAttribute('data-template'));
            });
        });
    }

    // Initialize when DOM is ready or when uploadSection becomes visible
    function init() {
        renderTemplateBar();

        // Also observe for uploadSection becoming visible
        var observer = new MutationObserver(function() {
            var uploadSection = document.getElementById('uploadSection');
            if (uploadSection && uploadSection.style.display !== 'none') {
                renderTemplateBar();
            }
        });

        var body = document.body;
        if (body) {
            observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.MemoryTemplates = {
        templates: templates,
        apply: applyTemplate,
        render: renderTemplateBar
    };
})();
