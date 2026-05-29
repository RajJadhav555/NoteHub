import matplotlib.pyplot as plt
import os

out_dir = r"C:\Users\ADMIN\.gemini\antigravity\brain\0f358b46-fba2-4c22-810a-f5053af73780\artifacts"

# 1. Pie Chart for Plagiarism Scan Outcomes
labels = ['Original Content\n(Passed)', 'Exact Duplicates\n(Blocked)', 'High Similarity\n(Flagged)']
sizes = [85, 12, 3]
colors = ['#4CAF50', '#F44336', '#FFC107']
explode = (0.05, 0, 0)  # explode 1st slice

fig1, ax1 = plt.subplots(figsize=(8, 6))
ax1.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
        shadow=False, startangle=90, textprops={'fontsize': 14})
ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
plt.title('Plagiarism Scan Outcomes (Test Phase)', fontsize=18, pad=20)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "plagiarism_pie_chart.png"), dpi=300)
plt.close()

# 2. Bar Chart for User Engagement by Department
departments = ['Computer Science', 'Engineering', 'Business', 'Arts']
uploads = [120, 95, 60, 45]
colors_bar = ['#2196F3', '#03A9F4', '#00BCD4', '#009688']

fig2, ax2 = plt.subplots(figsize=(10, 6))
bars = ax2.bar(departments, uploads, color=colors_bar)

# Add value labels on top of bars
for bar in bars:
    yval = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2, yval + 2, yval, ha='center', va='bottom', fontsize=12)

ax2.set_ylabel('Daily Uploads', fontsize=14)
ax2.set_title('User Engagement (Avg Daily Uploads by Dept)', fontsize=18, pad=20)
ax2.tick_params(axis='x', labelsize=12)
ax2.tick_params(axis='y', labelsize=12)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "engagement_bar_chart.png"), dpi=300)
plt.close()

print("Charts generated successfully!")
