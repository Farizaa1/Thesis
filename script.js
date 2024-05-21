document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-assessment').addEventListener('click', function() {
        document.getElementById('assessment-tool').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('risk-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(event.target);

        // Scoring mappings
        const scores = {
            'business-size': {
                '1-10': 10, '11-50': 20, '51-100': 30, '101-250': 40, 'More than 250': 50
            },
            'industry-type': {
                'Retail': 10, 'Manufacturing': 20, 'Finance': 50, 'Healthcare': 50, 'Technology': 30, 'Other': 10
            },
            'cyber-awareness': {
                'Very aware': 10, 'Somewhat aware': 20, 'Neutral': 30, 'Somewhat unaware': 40, 'Not aware at all': 50
            },
            'cyber-training': {
                'Yes': 10, 'No': 50, 'Planning to provide training': 30
            },
            'cyber-team': {
                'Yes, in-house': 10, 'Yes, outsourced': 20, 'No': 50
            },
            'cyber-policy': {
                'Yes': 10, 'No': 50, 'In development': 30
            },
            'incident-plan': {
                'Yes': 10, 'No': 50, 'In development': 30
            },
            'cyber-incidents': {
                'Yes': 50, 'No': 10
            }
        };

        // Calculate total score
        let totalRiskScore = 0;
        for (let key in scores) {
            totalRiskScore += scores[key][formData.get(key)] || 0;
        }

        // Cybersecurity measures score
        const measures = formData.getAll('cyber-measures');
        let measuresScore = 50 - (measures.length * 10);
        if (measures.includes('None of the above')) {
            measuresScore = 50;
        }
        totalRiskScore += measuresScore;

        // Determine likelihood of threat
        const likelihood = totalRiskScore > 300 ? 'High' : totalRiskScore > 200 ? 'Medium' : 'Low';

        // Create results container
        const resultsContainer = document.getElementById('results');
        resultsContainer.classList.remove('hidden');

        document.getElementById('risk-score').textContent = totalRiskScore;
        document.getElementById('likelihood').textContent = likelihood;

        const recommendationsList = document.getElementById('recommendations');
        recommendationsList.innerHTML = `
            <li>Ensure regular backups of critical data.</li>
            <li>Implement strong password policies.</li>
            <li>Provide cybersecurity training for employees.</li>
            ${measuresScore > 10 ? '<li>Consider adding firewall and antivirus solutions.</li>' : ''}
            ${scores['incident-plan'][formData.get('incident-plan')] > 10 ? '<li>Develop an incident response plan and test it regularly.</li>' : ''}
        `;
    });
});
