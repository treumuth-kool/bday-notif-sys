import pandas as pd
import mysql.connector
from datetime import datetime

# Estonian personal ID to birthdate conversion
def get_birthdate_from_isikukood(personal_id):
    century_code = int(personal_id[0])
    year = int(personal_id[1:3])
    month = int(personal_id[3:5])
    day = int(personal_id[5:7])

    if century_code in [1, 2]:
        year += 1800
    elif century_code in [3, 4]:
        year += 1900
    elif century_code in [5, 6]:
        year += 2000
    else:
        raise ValueError("Invalid Estonian personal ID")

    return datetime(year, month, day)

# Load CSV file
# csv_file = 'andmed.csv'
df = pd.read_csv("andmed.csv", sep=';', encoding='utf-8')

# MySQL connection

conn = mysql.connector.connect(
    host='',
    user='',
    password='',
    database=''
)
cursor = conn.cursor()

# Insert data into the MySQL table
insert_query = '''
INSERT INTO students (personal_id, first_name, last_name, birthdate, group_identifier)
VALUES (%s, %s, %s, %s, %s)
'''

for index, row in df.iterrows():
    personal_id = str(row['Isikukood'])
    last_name = row['Perenimi']
    first_name = row['Eesnimi']
    group_identifier = row['Õppegrupp']
    
    # Calculate birthdate from personal_id
    birthdate = get_birthdate_from_isikukood(personal_id)
    
    # Insert the row into the database
    cursor.execute(insert_query, (personal_id, first_name, last_name, birthdate, group_identifier))

# Commit changes and close connection
conn.commit()
cursor.close()
conn.close()

print("Data imported successfully.")
